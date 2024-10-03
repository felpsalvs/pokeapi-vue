<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close details"
        @click="$emit('close')"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="mb-6">
        <h2 class="text-2xl font-bold capitalize mb-2">
          {{ pokemon.name }}
          <span class="text-gray-500">#{{ pokemon.id }}</span>
        </h2>
        <img
          :src="pokemon.image"
          :alt="pokemon.name"
          class="w-48 h-48 mx-auto object-contain"
        />
      </div>

      <div class="grid gap-6">
        <section>
          <h3 class="text-lg font-semibold mb-2">Types</h3>
          <div class="flex gap-2">
            <span
              v-for="type in pokemon.types"
              :key="type"
              :class="[
                typeColors[type],
                'px-3 py-1 rounded-full text-white capitalize',
              ]"
            >
              {{ type }}
            </span>
          </div>
        </section>

        <section>
          <h3 class="text-lg font-semibold mb-2">Base Stats</h3>
          <div class="grid gap-3">
            <div
              v-for="stat in pokemon.stats"
              :key="stat.name"
              class="grid grid-cols-[120px,1fr] gap-4 items-center"
            >
              <span class="capitalize">{{ formatStatName(stat.name) }}</span>
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                    :style="{ width: `${(stat.value / 255) * 100}%` }"
                  ></div>
                </div>
                <span class="w-12 text-sm">{{ stat.value }}</span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="evolutionChain.length > 0">
          <h3 class="text-lg font-semibold mb-2">Evolution Chain</h3>
          <div class="flex items-center justify-center gap-4">
            <template
              v-for="(evolution, index) in evolutionChain"
              :key="evolution.id"
            >
              <div class="flex flex-col items-center">
                <img
                  :src="getPokemonImage(evolution.id)"
                  :alt="evolution.name"
                  class="w-24 h-24"
                />
                <span class="capitalize">{{ evolution.name }}</span>
              </div>
              <svg
                v-if="index < evolutionChain.length - 1"
                class="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </template>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { usePokemonStore } from "../../store/pokemon.store";
  import type { Pokemon, PokemonEvolution } from "../../types/pokemon.types";
  import { typeColors } from "../../utils/typeColors";

  const props = defineProps<{
    pokemon: Pokemon;
  }>();

  defineEmits<{
    (e: "close"): void;
  }>();

  const store = usePokemonStore();
  const evolutionChain = ref<PokemonEvolution[]>([]);

  function formatStatName(name: string): string {
    return name.replace("-", " ");
  }

  function getPokemonImage(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  onMounted(async () => {
    try {
      evolutionChain.value = await store.fetchEvolutionChain(
        props.pokemon.species,
      );
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      evolutionChain.value = [];
    }
  });
</script>
