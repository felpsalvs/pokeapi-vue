<template>
  <button
    class="px-4 py-2 rounded-lg transition-colors duration-300"
    :class="[variantClass, { 'opacity-50 cursor-not-allowed': disabled }]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  const props = defineProps<{
    variant: "primary" | "secondary" | "ghost";
    disabled?: boolean;
  }>();

  const variants: Record<string, string> = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    ghost: "hover:bg-gray-100",
  };

  const variantClass = variants[props.variant] || "";
</script>
