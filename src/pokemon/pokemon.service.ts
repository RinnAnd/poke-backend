import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

const pokeApi = 'https://pokeapi.co/api/v2/pokemon';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    const pokemonExists = await this.pokemonRepository.findOne({
      where: { name: createPokemonDto.name },
    });
    if (pokemonExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Pokemon already exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    const pokemon = this.pokemonRepository.create(createPokemonDto);
    return this.pokemonRepository.save(pokemon);
  }

  private async fetchPokemon(id: number) {
    const res = await fetch(`${pokeApi}/${id}`);
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      images: [
        data.sprites.other.home.front_default,
        data.sprites.other.showdown.front_default,
      ],
      types: data.types.map((type) => type.type.name),
      abilities: data.abilities.map((ability) => ability.ability.name),
      stats: data.stats.map((stat) => ({
        stat: stat.stat.name,
        base_stat: stat.base_stat,
      })),
    };
  }

  private async addChunkPokemons(
    start: number,
    end: number,
  ): Promise<Pokemon[]> {
    const pokemons = [];
    for (let i = start; i <= end; i++) {
      const data = await this.fetchPokemon(i);
      pokemons.push(data);
    }
    return pokemons;
  }

  async addAllPokemons() {
    const alreadeAdded = await this.pokemonRepository.find();
    if (alreadeAdded.length > 1000) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Pokemons have already been added',
        },
        HttpStatus.CONFLICT,
      );
    }
    const pokemons = (await this.addChunkPokemons(1, 1025)) as Pokemon[];
    if (pokemons.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch pokemons',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.pokemonRepository.save(pokemons);
  }

  async findAll() {
    return this.pokemonRepository.find();
  }

  async findOne(id: number) {
    const res = await this.pokemonRepository.findOne({ where: { id } });
    if (!res) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Pokemon not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return res;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    await this.pokemonRepository.update(id, updatePokemonDto);
    return this.pokemonRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const res = await this.pokemonRepository.delete(id);
    if (res.affected === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Pokemon not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: 'Pokemon deleted successfully',
      status: HttpStatus.OK,
      data: null,
    };
  }
}
