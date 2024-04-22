<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import SunIcon from "@/icons/SunIcon.vue";
import MoonIcon from "@/icons/MoonIcon.vue";

const isDark = useDark();
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="flex items-center">
    <button @click="toggleDark()" class="p-2 hover:scale-125 transition-all border border-gray-200 dark:border-gray-700 rounded-lg" aria-label="Darkmode">
      <SunIcon v-if="isDark === true" class="theme-toggle-icon size-5 transition-all duration-300" />
      <MoonIcon v-else-if="isDark === false" class="theme-toggle-icon size-5 transition-all duration-300" />
    </button>
  </div>
</template>