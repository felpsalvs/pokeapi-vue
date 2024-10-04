import { defineStore } from "pinia";
import { ref, computed } from "vue";
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

export interface PokemonEvolution {
  id: number;
  name: string;
}

interface ApiResponse {
  results: { name: string; url: string }[];
}

interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
}

export const usePokemonStore = defineStore("pokemon", () => {
  const pokemonList = ref<Pokemon[]>([]);
  const favorites = ref<number[]>([]);
  const currentPage = ref<number>(1);
  const itemsPerPage = 20;
  const totalItems = ref<number>(0);
  const searchTerm = ref<string>("");
  const selectedTypes = ref<string[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const filteredPokemon = computed(() => {
    return pokemonList.value.filter(
      (pokemon: Pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
        (selectedTypes.value.length === 0 ||
          pokemon.types.some((type: string) =>
            selectedTypes.value.includes(type),
          )),
    );
  });

  const paginatedPokemon = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPokemon.value.slice(start, end);
  });

  const favoritePokemon = computed(() => {
    return pokemonList.value.filter((pokemon: Pokemon) =>
      favorites.value.includes(pokemon.id),
    );
  });

  function loadFromCache() {
    const cachedPokemons = localStorage.getItem("pokemonList");
    if (cachedPokemons) {
      pokemonList.value = JSON.parse(cachedPokemons) as Pokemon[];
      totalItems.value = pokemonList.value.length;
    }
  }

  function saveToCache() {
    localStorage.setItem("pokemonList", JSON.stringify(pokemonList.value));
  }

  async function fetchPokemon(page = 1, limit = 100) {
    if (isLoading.value) return;
    isLoading.value = true;
    error.value = null;

    if (pokemonList.value.length) {
      isLoading.value = false;
      return;
    }

    try {
      const offset = (page - 1) * limit;
      const response = await axios.get<ApiResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      );
      const fetchedPokemons: (Pokemon | null)[] = await Promise.all(
        response.data.results.map(
          async (pokemon, index): Promise<Pokemon | null> => {
            // pequeno atraso para evitar sobrecarregar a API
            await new Promise((resolve) => setTimeout(resolve, index * 50));
            try {
              const details = await axios.get(pokemon.url);

              return {
                id: details.data.id,
                name: details.data.name,
                types: details.data.types.map(
                  (type: { type: { name: string } }) => type.type.name,
                ),
                stats: details.data.stats.map(
                  (stat: { stat: { name: string }; base_stat: number }) => ({
                    name: stat.stat.name,
                    value: stat.base_stat,
                  }),
                ),
                image: details.data.sprites.front_default,
                species: details.data.species.url,
              };
            } catch (err) {
              console.error("Error fetching Pokemon details:", err);
              return null;
            }
          },
        ),
      );

      pokemonList.value = [
        ...pokemonList.value,
        ...fetchedPokemons.filter(
          (pokemon): pokemon is Pokemon => pokemon !== null,
        ),
      ];

      totalItems.value = pokemonList.value.length;
      saveToCache();
    } catch (err) {
      console.error("Error fetching Pokemon:", err);
      error.value = "Failed to fetch Pokemon. Please try again later.";
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchEvolutionChain(speciesUrl: string) {
    try {
      const speciesResponse = await axios.get(speciesUrl);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      const evolutionResponse = await axios.get(evolutionChainUrl);
      return parseEvolutionChain(evolutionResponse.data.chain);
    } catch (err) {
      console.error("Error fetching evolution chain:", err);
      return [];
    }
  }

  function parseEvolutionChain(chain: EvolutionChain): PokemonEvolution[] {
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

  function toggleFavorite(pokemonId: number) {
    const index = favorites.value.indexOf(pokemonId);
    if (index === -1) {
      favorites.value.push(pokemonId);
    } else {
      favorites.value.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  }

  function loadFavorites() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      favorites.value = JSON.parse(storedFavorites) as number[];
    }
  }

  return {
    pokemonList,
    favorites,
    currentPage,
    totalItems,
    searchTerm,
    selectedTypes,
    filteredPokemon,
    paginatedPokemon,
    favoritePokemon,
    isLoading,
    error,
    fetchPokemon,
    fetchEvolutionChain,
    toggleFavorite,
    loadFavorites,
    loadFromCache,
  };
});
