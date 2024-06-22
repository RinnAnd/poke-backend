import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { UserPokemon } from 'src/user/entities/user-pokemon.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [User, Pokemon, UserPokemon],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
