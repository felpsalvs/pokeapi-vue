<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <div class="w-full">
        <base-input
          v-model="store.searchTerm"
          placeholder="Search Pokémon..."
          class="w-full"
        >
          <template #icon>
            <svg
              class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </template>
        </base-input>
      </div>

      <div class="overflow-x-auto">
        <div class="flex flex-wrap gap-2 py-2 min-w-max">
          <button
            v-for="type in allTypes"
            :key="type"
            :class="[
              store.selectedTypes.includes(type)
                ? typeColors[type]
                : 'bg-gray-200',
              'px-3 py-1 rounded-full text-sm capitalize transition-colors duration-300',
              store.selectedTypes.includes(type)
                ? 'text-white'
                : 'text-gray-700',
              'hover:opacity-90',
            ]"
            @click="toggleType(type)"
          >
            {{ type }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="store.paginatedPokemon.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <pokemon-card
        v-for="pokemon in store.paginatedPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        @show-details="showDetails"
      />
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      No Pokémon found matching your criteria
    </div>

    <div class="flex justify-center gap-2 flex-wrap">
      <base-button
        v-for="page in totalPages"
        :key="page"
        :variant="page === store.currentPage ? 'primary' : 'secondary'"
        class="min-w-[40px]"
        @click="store.currentPage = page"
      >
        {{ page }}
      </base-button>
    </div>

    <pokemon-details
      v-if="selectedPokemon"
      :pokemon="selectedPokemon"
      @close="selectedPokemon = null"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { usePokemonStore } from "../../store/pokemon.store";
  import type { Pokemon } from "../../types/pokemon.types";
  import { typeColors } from "../../utils/typeColors";
  import BaseInput from "../../components/ui/BaseInput.vue";
  import BaseButton from "../../components/ui/BaseButton.vue";
  import PokemonCard from "./PokemonCard.vue";
  import PokemonDetails from "./PokemonDetails.vue";

  const store = usePokemonStore();
  const selectedPokemon = ref<Pokemon | null>(null);

  const allTypes = computed(() => {
    const types = new Set<string>();
    store.pokemonList.forEach((pokemon) => {
      pokemon.types.forEach((type) => types.add(type));
    });
    return Array.from(types);
  });

  const totalPages = computed(() =>
    Math.ceil(store.filteredPokemon.length / 20),
  );

  function toggleType(type: string) {
    const index = store.selectedTypes.indexOf(type);
    if (index === -1) {
      store.selectedTypes.push(type);
    } else {
      store.selectedTypes.splice(index, 1);
    }
  }

  function showDetails(pokemon: Pokemon) {
    selectedPokemon.value = pokemon;
  }
</script>

<style scoped>
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }

  .overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
</style>
