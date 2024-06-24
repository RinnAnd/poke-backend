import { Module } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingController } from './trading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeOffer } from './entities/trade-offer.entity';
import { TradePokemon } from './entities/trade-pokemon.entity';
import { UserPokemon } from 'src/user/entities/user-pokemon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TradeOffer, TradePokemon, UserPokemon])],
  controllers: [TradingController],
  providers: [TradingService],
})
export class TradingModule {}
