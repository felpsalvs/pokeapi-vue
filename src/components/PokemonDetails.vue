<template>
  <div
    v-if="pokemon"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <button class="absolute top-2 right-2 text-2xl" @click="$emit('close')">
        &times;
      </button>
      <h2 class="text-2xl font-bold mb-4">
        {{ pokemon.name }} (#{{ pokemon.id }})
      </h2>
      <img
        :src="pokemon.image"
        :alt="pokemon.name"
        class="w-48 h-48 mx-auto mb-4"
      />

      <h3 class="text-xl font-semibold mb-2">Types</h3>
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

      <h3 class="text-xl font-semibold mb-2">Stats</h3>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div
          v-for="stat in pokemon.stats"
          :key="stat.name"
          class="flex flex-col"
        >
          <span class="font-medium">{{ stat.name }}</span>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full"
              :style="{ width: `${(stat.value / 255) * 100}%` }"
            ></div>
          </div>
          <span class="text-sm">{{ stat.value }}/255</span>
        </div>
      </div>

      <h3 class="text-xl font-semibold mb-2">Evolution Chain</h3>
      <div
        v-if="evolutionChain.length"
        class="flex justify-center items-center space-x-4"
      >
        <div
          v-for="(evolution, index) in evolutionChain"
          :key="evolution.id"
          class="flex flex-col items-center"
        >
          <img
            :src="getPokemonImage(evolution.id)"
            :alt="evolution.name"
            class="w-24 h-24"
          />
          <span>{{ evolution.name }}</span>
          <span v-if="index < evolutionChain.length - 1" class="text-2xl"
            >→</span
          >
        </div>
      </div>
      <p v-else>Loading evolution chain...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { usePokemonStore } from "../store/api";

  interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: string[];
    stats: Array<{ name: string; value: number }>;
    species: string;
  }

  interface Evolution {
    id: number;
    name: string;
  }

  const props = defineProps<{
    pokemon: Pokemon;
  }>();

  const store = usePokemonStore();
  const evolutionChain = ref<Evolution[]>([]);

  watch(
    () => props.pokemon,
    async (newPokemon) => {
      if (newPokemon) {
        evolutionChain.value = await store.fetchEvolutionChain(
          newPokemon.species,
        );
      }
    },
    { immediate: true },
  );

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

  function getPokemonImage(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
</script>
