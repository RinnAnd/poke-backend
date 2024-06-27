import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserPokemon } from '../../user/entities/user-pokemon.entity';

@Entity('trade-pokemon')
export class TradePokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserPokemon, (userPokemon) => userPokemon.id)
  userPokemon: UserPokemon;

  @Column({ default: false })
  traded: boolean;
}
