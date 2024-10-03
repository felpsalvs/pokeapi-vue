<template>
  <div class="relative w-full">
    <input
      :value="modelValue"
      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
      v-bind="$attrs"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <slot name="icon"></slot>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    modelValue: string;
  }>();

  defineEmits<{
    (e: "update:modelValue", value: string): void;
  }>();
</script>

<style scoped>
  input {
    min-width: 0;
  }

  @media (max-width: 640px) {
    input {
      font-size: 16px;
    }
  }
</style>
