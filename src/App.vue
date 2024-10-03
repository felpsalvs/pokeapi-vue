<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-red-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Pokédex</h1>
        <nav>
          <base-button
            v-for="(route, index) in routes"
            :key="index"
            :variant="currentRoute === route.path ? 'primary' : 'ghost'"
            class="mx-2"
            @click="currentRoute = route.path"
          >
            {{ route.name }}
          </base-button>
        </nav>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <component :is="currentView" />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { usePokemonStore } from "./store/pokemon.store";
  import HomeView from "./views/HomeView.vue";
  import FavoritesView from "./views/FavoritesView.vue";
  import BaseButton from "./components/ui/BaseButton.vue";

  const store = usePokemonStore();
  const currentRoute = ref("/");

  const routes = [
    { path: "/", name: "Home", component: HomeView },
    { path: "/favorites", name: "Favorites", component: FavoritesView },
  ];

  const currentView = computed(
    () =>
      routes.find((route) => route.path === currentRoute.value)?.component ||
      HomeView,
  );

  onMounted(async () => {
    store.loadFromCache();
    await store.fetchPokemon();
  });
</script>
