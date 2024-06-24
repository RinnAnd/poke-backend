import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { randomInt } from 'crypto';
import { ResponseDto } from 'src/dto/response.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPokemon } from './entities/user-pokemon.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(UserPokemon)
    private userPokemonRepository: Repository<UserPokemon>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return {
      message: 'User created successfully',
      status: HttpStatus.CREATED,
      data: user,
    };
  }

  async findAll() {
    const res = await this.userRepository.find();
    if (res.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NO_CONTENT,
          error: 'No users found',
        },
        HttpStatus.NO_CONTENT,
      );
    }
    return res;
  }

  async findOne(id: string) {
    const res = await this.userRepository.findOne({ where: { id } });
    if (!res) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return res;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const res = await this.userRepository.delete(id);
    if (res.affected === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: 'User deleted successfully',
      status: HttpStatus.OK,
      data: null,
    };
  }

  async auth(email: string, password: string): Promise<ResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Incorrect password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    return {
      message: 'User logged in successfully',
      status: HttpStatus.OK,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        jwt: token,
      },
    };
  }

  async addPokemon(id: string, pokemonId: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const pokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
    });
    if (!pokemon) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Pokemon not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const userPokemon = new UserPokemon();
    userPokemon.user = user;
    userPokemon.pokemon = pokemon;
    userPokemon.level = randomInt(1, 100);

    await this.userPokemonRepository.save(userPokemon);

    return {
      message: 'Pokemon added successfully',
      status: HttpStatus.OK,
      data: userPokemon,
    };
  }

  getUserPokemons(id: string) {
    return this.userPokemonRepository.find({
      where: { user: { id } },
      relations: ['pokemon'],
    });
  }
}
