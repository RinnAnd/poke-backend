import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserPokemon } from '../../user/entities/user-pokemon.entity';
import { TradeOffer } from './trade-offer.entity';

@Entity('trade-pokemon')
export class TradePokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserPokemon, (userPokemon) => userPokemon.id)
  userPokemon: UserPokemon;

  @OneToMany(() => TradeOffer, (tradeOffer) => tradeOffer.id)
  tradeOffers: TradeOffer[];
}
