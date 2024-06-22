import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Pokemon } from '../../pokemon/entities/pokemon.entity';
import { User } from './user.entity';

export class UserPokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.pokemons)
  user: User;

  @ManyToOne(() => Pokemon)
  pokemon: Pokemon;

  @Column()
  level: number;
}
