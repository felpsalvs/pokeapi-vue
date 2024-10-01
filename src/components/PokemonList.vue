<template>
  <div class="container mx-auto px-4">
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-center">
      <input
        v-model="store.searchTerm"
        type="text"
        placeholder="Buscar Pokémon por nome ou número"
        class="p-2 border rounded mb-2 sm:mb-0 w-full sm:w-auto"
      />
      <div class="flex flex-wrap justify-center sm:justify-start">
        <button
          v-for="type in allTypes"
          :key="type"
          class="m-1 px-2 py-1 rounded text-xs"
          :class="
            store.selectedTypes.includes(type)
              ? getTypeColor(type) + ' text-white'
              : 'bg-gray-200'
          "
          @click="toggleType(type)"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <div
      v-if="!store.isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <pokemon-card
        v-for="pokemon in store.paginatedPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        @show-details="showPokemonDetails"
      />
    </div>

    <div v-else class="text-center">
      <p>Carregando Pokémon...</p>
    </div>

    <div class="mt-4 flex justify-center flex-wrap">
      <button
        v-for="page in totalPages"
        :key="page"
        class="m-1 px-3 py-1 rounded transition-colors duration-300"
        :class="{
          'bg-blue-500 text-white': page === store.currentPage,
          'bg-gray-200 hover:bg-gray-300': page !== store.currentPage,
        }"
        @click="store.currentPage = page"
      >
        {{ page }}
      </button>
    </div>

    <pokemon-details
      v-if="selectedPokemon"
      :pokemon="selectedPokemon"
      @close="selectedPokemon = null"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from "vue";
  import { usePokemonStore } from "../store/api";
  import PokemonCard from "./PokemonCard.vue";
  import PokemonDetails from "./PokemonDetails.vue";

  const store = usePokemonStore();
  const selectedPokemon = ref(null);

  const totalPages = computed(() =>
    Math.ceil(store.filteredPokemon.length / 20),
  );

  const allTypes = computed(() => {
    const types = new Set();
    store.pokemonList.forEach((pokemon) => {
      pokemon.types.forEach((type) => types.add(type));
    });
    return Array.from(types);
  });

  function toggleType(type) {
    const index = store.selectedTypes.indexOf(type);
    if (index === -1) {
      store.selectedTypes.push(type);
    } else {
      store.selectedTypes.splice(index, 1);
    }
  }

  function showPokemonDetails(pokemon) {
    selectedPokemon.value = pokemon;
  }

  function getTypeColor(type: string) {
    const colors = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-200",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-700",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-600",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-700",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };
    return colors[type] || "bg-gray-400";
  }

  onMounted(() => {
    store.fetchPokemon();
    store.loadFavorites();
  });
</script>
