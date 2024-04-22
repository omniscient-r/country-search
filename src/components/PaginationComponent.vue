<template>
  <form class="flex sm:flex-row flex-col items-center gap-3 mb-[10px]">
    <div class="relative flex items-center sm:w-2/3 w-full">
      <SearchIcon class="absolute mx-2" />
      <input
        v-model.trim="filterInput"
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search by country name"
      />
    </div>
    <!-- Region Select -->
    <select v-model="selectedRegion" aria-label="Regiones" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block sm:w-1/3 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer">
      <option value="">All Regions</option>
      <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
    </select>
    <button @click="resetFilters()" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-sm rounded-lg p-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
      Reset
    </button>
  </form>
  <Transition name="fade" tag="div" mode="in-out">
    <slot :array="results"></slot>
  </Transition>
  <!-- If theres no results -->
  <div v-if="results.length === 0" class="text-center mt-8">
    <p>
      Country not found.
    </p>
  </div>
  <template v-if="array.length > 1">
    <nav class="my-7">
      <ul class="flex justify-center items-center">
        <li class="px-[15px] py-[10px]" :class="currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'">
          <ArrowLeftIcon @click="prevPage" />
        </li>
        <li v-for="(element, index) in paginationElements" :key="index" class="sm:px-[15px] px-1 py-[10px] cursor-pointer" :class="{ active: element.page===currentPage, disabled: element.type==='ellipse-break'  }">
          <template v-if="element.type==='page'">
            <span :ref="'pageLink'+element.page" class="pb-[10px]" @click="goToPage(element.page)" href="javascript:void(0)">{{element.page}}</span>
          </template>
          <template v-if="element.type==='ellipse-break'">
            <span class="page-link" href="javascript:void(0)">...</span>
          </template>
        </li>
        <li class="px-[15px] py-[10px]" :class="currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'">
          <ArrowRightIcon @click="nextPage" />
        </li>
      </ul>
    </nav>
  </template>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import SearchIcon from "@/icons/SearchIcon.vue";
import ArrowLeftIcon from "@/icons/ArrowLeftIcon.vue";
import ArrowRightIcon from "@/icons/ArrowRightIcon.vue";

const props = defineProps({
  array: {
    type: Array,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  pagesDropdown: {
    type: Boolean,
    required: false,
  }
});

  const currentPage = ref(1);
  const totalItems = ref(0);
  const results = ref([]);
  const totalPages = ref(0);
  const paginationElements = ref([]);
  const step = ref(1);
  const filterInput = ref('');
  const selectedRegion = ref('');
  // Define regions array
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  onMounted(() => {
    updateResults();
  });

  // Add a watcher for updateResults
  watch([filterInput, selectedRegion], () => {
    currentPage.value = 1; // Reset to the first page when searching
    updateResults();
  });

  const resetFilters = () => {
    filterInput.value = '';
    selectedRegion.value = '';
  };

  function updateResults() {
    let sortedItems = props.array.slice(0);

    let filteredItems = sortedItems.filter(item =>
      (selectedRegion.value ? item.region === selectedRegion.value : true) &&
      item.name.common.toLowerCase().includes(filterInput.value.toLowerCase())
    );

    totalItems.value = filteredItems.length;
    let pagedItems = filteredItems.filter((row, index) => {
      let start = (currentPage.value - 1) * props.itemsPerPage;
      let end = currentPage.value * props.itemsPerPage;
      if (index >= start && index < end) {
        return true;
      }
    });

    results.value = pagedItems;
    updatePagination();
  };

  function nextPage() {
    if ((currentPage.value * props.itemsPerPage) < totalItems.value) {
      currentPage.value++;
    }
    updateResults();
  };

  function goToPage(page) {
    currentPage.value = page;
    nextTick(() => {
      const pageLink = document.querySelector(`#pageLink${currentPage.value}`);
      if (pageLink) {
        pageLink.focus();
      }
    });
    updateResults();
  };

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
    updateResults();
  };

  function addPage(page) {
    paginationElements.value.push({
      type: 'page',
      page: page
    }, )
  };

  function addSeparator() {
    // Add first page with addSeparator
    paginationElements.value.push({
      type: 'ellipse-break'
    })
  };

  function addPages(s, f) {
    for (var i = s; i < f; i++) {
      paginationElements.value.push({
        type: 'page',
        page: i
      })
    }
  };

  function updatePagination() {
    paginationElements.value = [];
    totalPages.value = Math.ceil(totalItems.value / props.itemsPerPage);
    if (totalPages.value < step.value * 2 + 6) {
      // Case without any ellipse breaks
      addPages(1, totalPages.value + 1);
    } else if (currentPage.value < step.value * 2 + 1) {
      // Case with ellipse breaks at end
      addPages(1, step.value * 2 + 4);
      addSeparator();
      addPage(totalPages.value);
    } else if (currentPage.value > totalPages.value - step.value * 2) {
      // Case with ellipse breaks at beginning
      addPage(1);
      addSeparator();
      addPages(totalPages.value - step.value * 2 - 2, totalPages.value + 1);
    } else {
      // Case with ellipse breaks at beginning and end
      addPage(1);
      addSeparator();
      addPages(currentPage.value - step.value, currentPage.value + step.value + 1);
      addSeparator();
      addPage(totalPages.value);
    }
  }
</script>

<style scoped>
.active {
  z-index: 1;
  color: #007bff;
}

.radio-label:checked ~ label {
  background: #f8f8fa;
  color: #000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease, background-image 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  background-image: none; /* Start with no background image */
}
</style>
