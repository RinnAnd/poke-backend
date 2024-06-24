import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TradePokemon } from './entities/trade-pokemon.entity';
import { UserPokemon } from '../user/entities/user-pokemon.entity';
import { TradeOffer } from './entities/trade-offer.entity';

@Injectable()
export class TradingService {
  constructor(
    @InjectRepository(TradePokemon)
    private tradeRepository: Repository<TradePokemon>,
    @InjectRepository(UserPokemon)
    private userPokemonRepository: Repository<UserPokemon>,
    @InjectRepository(TradeOffer)
    private tradeOfferRepository: Repository<TradeOffer>,
  ) {}
  async addPokemonTrade(userPokemonId: string) {
    const userPokemonExists = await this.userPokemonRepository.findOne({
      where: { id: userPokemonId },
    });
    if (!userPokemonExists) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User Pokemon not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const trade = this.tradeRepository.create({
      userPokemon: { id: userPokemonId },
    });

    await this.userPokemonRepository.update(userPokemonId, { forTrade: true });

    return this.tradeRepository.save(trade);
  }

  async removePokemonTrade(userPokemonId: string) {
    const trade = await this.tradeRepository.findOne({
      where: { userPokemon: { id: userPokemonId } },
    });

    if (!trade) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Trade not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userPokemonRepository.update(userPokemonId, { forTrade: false });
  }

  async getPokemonsForTrade() {
    return this.tradeRepository.find({
      relations: ['userPokemon', 'userPokemon.pokemon'],
      where: { userPokemon: { forTrade: true } },
    });
  }

  async proposeTrade(tradeId: string, userPokemonId: string) {
    const openTrade = await this.tradeRepository.findOne({
      where: { id: tradeId },
    });

    if (!openTrade) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Trade not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const pokemonToOffer = await this.userPokemonRepository.findOne({
      where: { id: userPokemonId },
    });

    if (!pokemonToOffer) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Pokemon not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const pokemonToOfferTrade = await this.addPokemonTrade(userPokemonId);

    const tradeOffer = this.tradeOfferRepository.create({
      targetTradePokemon: openTrade,
      offeredTradePokemon: pokemonToOfferTrade,
      status: 'pending',
    });

    return this.tradeOfferRepository.save(tradeOffer);
  }

  async getTradeOffers() {
    return this.tradeOfferRepository.find({
      relations: ['offeredTradePokemon', 'targetTradePokemon'],
    });
  }

  async confirmTrade(tradeId: string, accepted: boolean) {
    const tradeOffer = await this.tradeOfferRepository.findOne({
      where: { id: tradeId },
      relations: [
        'offeredTradePokemon.userPokemon',
        'targetTradePokemon.userPokemon',
        'offeredTradePokemon.userPokemon.user',
        'targetTradePokemon.userPokemon.user',
      ],
    });

    if (!tradeOffer) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Trade offer not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (tradeOffer.status !== 'pending') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Trade offer already resolved',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (accepted) {
      const targetPokemonId = tradeOffer.targetTradePokemon.userPokemon.id;
      const offeredPokemonId = tradeOffer.offeredTradePokemon.userPokemon.id;

      await this.userPokemonRepository.update(targetPokemonId, {
        user: tradeOffer.offeredTradePokemon.userPokemon.user,
      });
      await this.userPokemonRepository.update(offeredPokemonId, {
        user: tradeOffer.targetTradePokemon.userPokemon.user,
      });

      this.removePokemonTrade(targetPokemonId);
      this.removePokemonTrade(offeredPokemonId);

      await this.tradeOfferRepository.update(tradeId, { status: 'accepted' });

      return {
        status: 200,
        message: 'Trade confirmed',
        data: {
          targetPokemonId,
          offeredPokemonId,
        },
      };
    } else {
      await this.tradeOfferRepository.update(tradeId, { status: 'rejected' });
    }
  }
}
