import { Type } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class Stat {
  base_stat: number;
  stat: string;
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

  @Column('text', { name: 'image', array: true })
  images: string[];

  @Column('text', { name: 'types', array: true })
  types: string[];

  @Column('text', { name: 'abilities', array: true })
  abilities: string[];

  @Column('json', { name: 'stats' })
  @Type(() => Stat)
  stats: Stat[];
}
