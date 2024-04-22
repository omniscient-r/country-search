<script setup lang="ts">
  // import CountrySearch from "./components/CountrySearch.vue";
  import { defineAsyncComponent } from "vue";

  const CountrySearch = defineAsyncComponent(() =>
    import("@/components/CountrySearch.vue")
  );
</script>

<template>
  <CountrySearch />
</template>

<style scoped>
</style>
