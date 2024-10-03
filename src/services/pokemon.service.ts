import { ApiService } from "./api.service";
import type { Pokemon, PokemonEvolution } from "../types/pokemon.types";

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
}

interface EvolutionChain {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
}

export class PokemonService {
  private api = ApiService.getInstance().client;

  async getPokemonList(limit: number, offset: number): Promise<Pokemon[]> {
    try {
      const response = await this.api.get(
        `/pokemon?limit=${limit}&offset=${offset}`,
      );
      return Promise.all(
        response.data.results.map(async (pokemon: { url: string }) => {
          const details = await this.api.get(pokemon.url);
          return this.transformPokemonData(details.data);
        }),
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getEvolutionChain(speciesUrl: string): Promise<PokemonEvolution[]> {
    try {
      const speciesResponse = await this.api.get(speciesUrl);
      const evolutionResponse = await this.api.get(
        speciesResponse.data.evolution_chain.url,
      );
      return this.parseEvolutionChain(evolutionResponse.data.chain);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private transformPokemonData(data: {
    id: number;
    name: string;
    sprites: { front_default: string };
    types: PokemonType[];
    stats: PokemonStat[];
    species: { url: string };
  }): Pokemon {
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((type) => type.type.name),
      stats: data.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      species: data.species.url,
    };
  }

  private parseEvolutionChain(chain: EvolutionChain): PokemonEvolution[] {
    const evolutions: PokemonEvolution[] = [];
    let current: EvolutionChain | undefined = chain;

    while (current) {
      evolutions.push({
        name: current.species.name,
        id: parseInt(current.species.url.split("/").slice(-2, -1)[0]),
      });
      current = current.evolves_to[0];
    }

    return evolutions;
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return new Error(error.message);
    } else if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const responseError = error as {
        response: { data: { message: string } };
      };
      return new Error(responseError.response.data.message);
    }
    return new Error("Failed to fetch Pokemon data");
  }
}
