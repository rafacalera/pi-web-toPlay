<template>
  <div class="flex justify-center">
    <AutoComplete class="teste" v-model="value" :suggestions="items" @complete="search" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const value = ref("");
const items = ref([]);

const search = (event) => {
  items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
}
</script>