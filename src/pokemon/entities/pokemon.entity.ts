import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';

class Types {
  type: {
    name: string;
  };
}

class Ability {
  ability: {
    name: string;
  };
}

class Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

class Move {
  move: {
    name: string;
  };
}

@Entity('pokemon')
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
    unique: true,
    name: 'name',
  })
  name: string;

  @Column('int', { name: 'height' })
  height: number;

  @Column('int', { name: 'weight' })
  weight: number;

  @Column('text', { name: 'image' })
  image: string;

  @Column('json', { name: 'types' })
  @Type(() => Types)
  types: Types[];

  @Column('json', { name: 'abilities' })
  @Type(() => Ability)
  abilities: Ability[];

  @Column('json', { name: 'stats' })
  @Type(() => Stat)
  stats: Stat[];

  @Column('json', { name: 'moves' })
  @Type(() => Move)
  moves: Move[];
}
