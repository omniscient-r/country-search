<script setup lang="ts">
  import { ref, defineAsyncComponent, onMounted } from "vue";
  // import DarkMode from "@/components/DarkMode.vue";
  // import PaginationComponent from "@/components/PaginationComponent.vue";

  const DarkMode = defineAsyncComponent(() =>
    import("@/components/DarkMode.vue")
  );

  const PaginationComponent = defineAsyncComponent(() =>
    import("@/components/PaginationComponent.vue")
  );

  const ModaComp = defineAsyncComponent(() =>
    import("@/components/ModalComponent.vue")
  );

  const url = "https://restcountries.com/v3.1/all";
  const countriesArray = ref([]);
  const modalStates = ref<boolean[]>([]);

  const fetchData = async () => {
    const options = {
      method: "GET"
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      countriesArray.value = data;
    } catch (error) {
      console.error(error);
    }
  };

  // Call fetchData when the component is mounted
  onMounted(() => {
    fetchData();
  });

const openModal = (index: number) => {
  modalStates.value[index] = true; // Update the state at the specified index
};

const closeModal = (index: number) => {
  modalStates.value[index] = false; // Update the state at the specified index
};
</script>

<template>
  <header class="container mx-auto px-4 py-4">
    <div class="relative flex flex-col gap-4">
      <DarkMode class="md:absolute justify-end right-0 top-0 px-4" />
      <h1 class="lg:text-5xl md:text-4xl text-3xl text-center">
        Country Search
      </h1>
      <p>
        Welcome to Country Search! Explore detailed information about countries from around the world. Click on a country to view its capital, languages, population, and more. <br />
        Use the search bar to find specific countries or browse through the list with pagination controls. Enjoy discovering fascinating facts about different nations!
      </p>
    </div>
  </header>

  <main class="container mx-auto px-4 pb-4">
    <PaginationComponent v-if="countriesArray.length" :array="countriesArray" :itemsPerPage="8" :pagesDropdown="false">
      <template #default="{ array }">
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
          <div v-for="(item, index) in array" :key="index" class="group cursor-pointer p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-[375px]">
            <div class="relative flex flex-col h-full">
              <img :src="item.flags.svg" :alt="item.flags.alt ? item.flags.alt : `Coat of Arms of ${item.name.common}`" class="object-cover w-full md:h-40 h-48 md:group-hover:h-48 md:scale-75 md:group-hover:scale-100 transition-all duration-300" />
              <div class="flex flex-col h-full text-gray-600 dark:text-white">
                <h2 class="mb-2 text-2xl font-semibold tracking-tight text-center">
                  {{ item.name.common }}
                </h2>
                <div class="flex items-center justify-center w-full">
                  <table class="">
                    <tbody>
                      <!-- Capital -->
                      <tr v-if="item.capital">
                        <td class="p-1 text-right text-sm font-medium">
                          Capital:
                        </td>
                        <td class="p-1">
                          <p v-for="(ele, index) in Object.values(item.capital).slice(0, 1)" :key="index">
                            {{ ele }}
                          </p>
                        </td>
                      </tr>

                      <!-- Language(s) -->
                      <tr v-if="item.languages">
                        <td class="p-1 text-right text-sm font-medium">
                          Language(s):
                        </td>
                        <td class="p-1">
                          <p v-for="(lang, index) in Object.values(item.languages).slice(0, 1)" :key="index" class="">
                            {{ lang }}
                          </p>
                        </td>
                      </tr>

                      <!-- Popoulation -->
                      <tr v-if="item.population">
                        <td class="p-1 text-right text-sm font-medium">
                          Popoulation:
                        </td>
                        <td class="p-1 text-sm">
                          {{ item.population }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- Modal Btn -->
                <div class="absolute bottom-0 right-0 md:invisible group-hover:visible transition-all duration-300 md:opacity-0 group-hover:opacity-100 md:translate-x-7 md:group-hover:-translate-x-3">
                  <button @click="openModal(index)">More Info</button>
                </div>
                <!-- Modal Component -->
                <ModaComp
                  :modalActive="modalStates[index]"
                  :animationType="'center'"
                  :positionModal="'center'"
                  @close="closeModal(index)"
                >
                  <!-- Modal content -->
                  <div class="flex flex-col items-center">
                    <h3 class="text-4xl">{{ item.name.common }}</h3>
                    <img v-if="item.coatOfArms.svg" :src="item.coatOfArms.svg" :alt="`Coat of Arms of ${item.name.common}`" class="w-[400px] h-[400px]" />
                    <img v-else :src="item.flags.svg" :alt="`Coat of Arms of' + ${item.name.common}`" class="w-full h-[400px]" />
                    <table class="min-w-full divide-y divide-gray-200 text-gray-600 dark:text-white">
                      <tbody class="divide-y divide-gray-400">
                        <!-- Capital -->
                        <tr>
                          <td class="px-6 py-3 text-right text-sm font-medium">
                            Capital:
                          </td>
                          <td class="px-6 py-3">
                            <ul class="list-disc list-inside">
                              <li v-for="(ele, index) in item.capital" :key="index" class="text-sm">
                                {{ ele }}
                              </li>
                            </ul>
                          </td>
                        </tr>

                        <!-- Language(s) -->
                        <tr>
                          <td class="px-6 py-3 text-right text-sm font-medium">
                            Language(s):
                          </td>
                          <td class="px-6 py-3">
                            <ul v-if="item.languages" class="list-disc list-inside line-clamp-3">
                              <li v-for="(lang, index) in item.languages" :key="index" class="text-sm">
                                {{ lang }}
                              </li>
                            </ul>
                            <p v-else class="text-sm">NULL</p>
                          </td>
                        </tr>

                        <!-- Popoulation -->
                        <tr>
                          <td class="px-6 py-3 text-right text-sm font-medium">
                            Popoulation:
                          </td>
                          <td class="px-6 py-3 text-sm">
                            {{ item.population }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </ModaComp>
              </div>
            </div>
          </div>
        </div>
      </template>
    </PaginationComponent>
  </main>
</template>

<style scoped>
</style>
