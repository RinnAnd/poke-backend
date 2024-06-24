import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserPokemon } from './user-pokemon.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    unique: true,
    name: 'username',
  })
  username: string;

  @Column('varchar', {
    length: 255,
    name: 'password',
  })
  password: string;

  @Column('varchar', {
    length: 255,
    name: 'email',
  })
  email: string;

  @Column('varchar', {
    length: 255,
    name: 'name',
  })
  name: string;

  @OneToMany(() => UserPokemon, (userPokemon) => userPokemon.user)
  pokemons: UserPokemon[];
}
