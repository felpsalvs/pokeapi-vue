<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-red-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Pokédex</h1>
        <nav>
          <button
            class="mx-2 py-1 px-3 rounded transition-colors duration-300"
            :class="{
              'bg-white text-red-600': currentView === 'list',
              'hover:bg-red-500': currentView !== 'list',
            }"
            @click="currentView = 'list'"
          >
            Lista
          </button>
          <button
            class="mx-2 py-1 px-3 rounded transition-colors duration-300"
            :class="{
              'bg-white text-red-600': currentView === 'favorites',
              'hover:bg-red-500': currentView !== 'favorites',
            }"
            @click="currentView = 'favorites'"
          >
            Favoritos
          </button>
        </nav>
      </div>
    </header>
    <main class="p-4">
      <div v-if="store.isLoading" class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"
        ></div>
        <p class="mt-2">Carregando Pokémon...</p>
      </div>
      <div v-else-if="store.error" class="text-center py-8 text-red-600">
        {{ store.error }}
      </div>
      <template v-else>
        <transition name="fade" mode="out-in">
          <keep-alive>
            <pokemon-list v-if="currentView === 'list'" />
            <favorites-list v-else-if="currentView === 'favorites'" />
          </keep-alive>
        </transition>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { usePokemonStore } from "./store/api";
  import PokemonList from "./components/PokemonList.vue";
  import FavoritesList from "./components/FavoritesList.vue";

  const store = usePokemonStore();
  const currentView = ref("list");

  onMounted(() => {
    store.fetchPokemon();
    store.loadFavorites();
  });
</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
