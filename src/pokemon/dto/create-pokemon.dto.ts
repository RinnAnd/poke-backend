export class CreatePokemonDto {
  name: string;
  height: number;
  weight: number;
  images: string[];
  types: string[];
  abilities: string[];
  stats: {
    base_stat: number;
    stat: string;
  }[];
}
