<template>
  <div class="container mx-auto px-4">
    <h2 class="text-2xl font-bold mb-4">Favoritos</h2>
    <div
      v-if="store.favoritePokemon.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <pokemon-card
        v-for="pokemon in store.favoritePokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        @show-details="showPokemonDetails"
      />
    </div>
    <p v-else class="text-center text-gray-600">
      Você ainda não tem Pokémon favoritos.
    </p>
    <pokemon-details
      v-if="selectedPokemon"
      :pokemon="selectedPokemon"
      @close="selectedPokemon = null"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { usePokemonStore } from "../store/pokemon.store";
  import PokemonCard from "./pokemon/PokemonCard.vue";
  import PokemonDetails from "./pokemon/PokemonDetails.vue";
  import type { Pokemon } from "../store/pokemon.store";

  const store = usePokemonStore();
  const selectedPokemon = ref<Pokemon | null>(null);

  function showPokemonDetails(pokemon: Pokemon) {
    selectedPokemon.value = pokemon;
  }
</script>
