export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStat[];
  species: string;
}

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonEvolution {
  id: number;
  name: string;
}
