import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Pokemon, PokemonEvolution } from "../types/pokemon.types";
import { PokemonService } from "../services/pokemon.service";

export const usePokemonStore = defineStore("pokemon", () => {
  const pokemonService = new PokemonService();

  const pokemonList = ref<Pokemon[]>([]);
  const favorites = ref<number[]>([]);
  const currentPage = ref(1);
  const itemsPerPage = 20;
  const searchTerm = ref("");
  const selectedTypes = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filteredPokemon = computed(() => {
    return pokemonList.value.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
        (selectedTypes.value.length === 0 ||
          pokemon.types.some((type) => selectedTypes.value.includes(type))),
    );
  });

  const paginatedPokemon = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredPokemon.value.slice(start, start + itemsPerPage);
  });

  const favoritePokemon = computed(() =>
    pokemonList.value.filter((pokemon) => favorites.value.includes(pokemon.id)),
  );

  async function fetchPokemon(page = 1, limit = 100) {
    if (isLoading.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      const data = await pokemonService.getPokemonList(
        limit,
        (page - 1) * limit,
      );
      pokemonList.value = data;
      saveToCache();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch Pokemon";
    } finally {
      isLoading.value = false;
    }
  }

  function toggleFavorite(pokemonId: number) {
    const index = favorites.value.indexOf(pokemonId);
    if (index === -1) {
      favorites.value.push(pokemonId);
    } else {
      favorites.value.splice(index, 1);
    }
    saveFavoritesToCache();
  }

  function loadFromCache() {
    const cached = localStorage.getItem("pokemonList");
    if (cached) {
      pokemonList.value = JSON.parse(cached);
    }

    const cachedFavorites = localStorage.getItem("favorites");
    if (cachedFavorites) {
      favorites.value = JSON.parse(cachedFavorites);
    }
  }

  function saveToCache() {
    localStorage.setItem("pokemonList", JSON.stringify(pokemonList.value));
  }

  function saveFavoritesToCache() {
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  }

  async function fetchEvolutionChain(
    speciesUrl: string,
  ): Promise<PokemonEvolution[]> {
    try {
      return await pokemonService.getEvolutionChain(speciesUrl);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch evolution chain";
      return [];
    }
  }

  return {
    pokemonList,
    favorites,
    currentPage,
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
    loadFromCache,
  };
});
