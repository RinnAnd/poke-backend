import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TradePokemon } from './trade-pokemon.entity';

@Entity('trade-offer')
export class TradeOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TradePokemon, (tradePokemon) => tradePokemon.id)
  targetTradePokemon: TradePokemon;

  @ManyToOne(() => TradePokemon, (tradePokemon) => tradePokemon.id)
  offeredTradePokemon: TradePokemon;

  @Column()
  status: string; // 'pending' | 'accepted' | 'rejected'
}

// Remember you need an endpoint to confirm the exchange: /trades/:id/confirm
