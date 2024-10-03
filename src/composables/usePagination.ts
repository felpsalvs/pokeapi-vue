import { ref, computed } from "vue";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const currentPage = ref(1);
  const total = computed(() => items.length);
  const totalPages = computed(() => Math.ceil(total.value / itemsPerPage));

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  });

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  return {
    currentPage,
    total,
    totalPages,
    paginatedItems,
    goToPage,
  };
}
