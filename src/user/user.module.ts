import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { UserPokemon } from './entities/user-pokemon.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPokemon, Pokemon])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
