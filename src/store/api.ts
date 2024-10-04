import axios from "axios";

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStat[];
  species: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

interface ApiResponse {
  results: { name: string; url: string }[];
}

export interface PokemonEvolution {
  id: number;
  name: string;
}

interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
}

export const fetchPokemonList = async (
  limit: number,
  offset: number,
): Promise<Pokemon[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    );

    const fetchedPokemons = await Promise.all(
      response.data.results.map(
        async (pokemon, index): Promise<Pokemon | null> => {
          try {
            // pequeno atraso para evitar sobrecarga na API
            await new Promise((resolve) => setTimeout(resolve, index * 50));
            const details = await axios.get(pokemon.url);

            return {
              id: details.data.id,
              name: details.data.name,
              image: details.data.sprites.front_default,
              types: details.data.types.map(
                (type: { type: { name: string } }) => type.type.name,
              ),
              stats: details.data.stats.map(
                (stat: { stat: { name: string }; base_stat: number }) => ({
                  name: stat.stat.name,
                  value: stat.base_stat,
                }),
              ),
              species: details.data.species.url,
            };
          } catch (error) {
            console.error(
              `Erro ao buscar detalhes do Pokémon: ${pokemon.name}`,
              error,
            );
            return null;
          }
        },
      ),
    );

    const pokemonList: Pokemon[] = fetchedPokemons.filter(
      (pokemon): pokemon is Pokemon => pokemon !== null,
    );

    return pokemonList;
  } catch (error) {
    console.error("Erro ao buscar a lista de Pokémon:", error);
    throw new Error("Falha ao buscar a lista de Pokémon.");
  }
};

export const fetchEvolutionChain = async (
  speciesUrl: string,
): Promise<PokemonEvolution[]> => {
  try {
    const speciesResponse = await axios.get(speciesUrl);
    const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
    const evolutionResponse = await axios.get(evolutionChainUrl);

    return parseEvolutionChain(evolutionResponse.data.chain);
  } catch (error) {
    console.error("Erro ao buscar cadeia de evolução:", error);
    throw new Error("Falha ao buscar a cadeia de evolução.");
  }
};

const parseEvolutionChain = (chain: EvolutionChain): PokemonEvolution[] => {
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
};
