<template>
  <div>
    <div v-if="store.isLoading" class="flex justify-center items-center h-64">
      <loading-spinner />
    </div>
    <div v-else-if="store.error" class="text-red-500 text-center">
      {{ store.error }}
    </div>
    <pokemon-list v-else />
  </div>
</template>

<script setup lang="ts">
  import { usePokemonStore } from "../store/pokemon.store";
  import PokemonList from "../components/pokemon/PokemonList.vue";
  import LoadingSpinner from "../components/ui/LoadingSpinner.vue";

  const store = usePokemonStore();
</script>
