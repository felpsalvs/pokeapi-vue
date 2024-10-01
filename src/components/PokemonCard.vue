<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
    @click="showDetails"
  >
    <img
      :src="pokemon.image"
      :alt="pokemon.name"
      class="w-32 h-32 mx-auto mb-4"
    />
    <h2 class="text-xl font-bold mb-2">{{ pokemon.name }}</h2>
    <p class="text-gray-600 mb-2">#{{ pokemon.id }}</p>
    <div class="flex justify-center space-x-2 mb-4">
      <span
        v-for="type in pokemon.types"
        :key="type"
        class="px-2 py-1 rounded-full text-xs text-white"
        :class="getTypeColor(type)"
      >
        {{ type }}
      </span>
    </div>
    <button
      class="text-2xl focus:outline-none transition-transform duration-300 transform hover:scale-110"
      @click.stop="toggleFavorite"
    >
      {{ isFavorite ? "❤️" : "🤍" }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { usePokemonStore } from "../store/api";

  interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: string[];
  }

  const props = defineProps<{
    pokemon: Pokemon;
  }>();

  const emit = defineEmits<(e: "showDetails", pokemon: Pokemon) => void>();

  const store = usePokemonStore();

  const isFavorite = computed(() => store.favorites.includes(props.pokemon.id));

  function toggleFavorite() {
    store.toggleFavorite(props.pokemon.id);
  }

  function showDetails() {
    emit("showDetails", props.pokemon);
  }

  function getTypeColor(type: string): string {
    const colors: Record<string, string> = {
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
</script>
