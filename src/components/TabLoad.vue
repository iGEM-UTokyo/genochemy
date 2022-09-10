<template>
  <div class="tab-content">
    <button @click="load">Import UTokyo 2022 Project</button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import questions from "@/utils/questions";
import importJson from "@/utils/importer";

const { addSnake } = useStore();

function load() {
  const snakes = importJson(questions[8].answer);
  addSnake(...snakes);
}
</script>

<style scoped>
button {
  background-color: white;
  border: 1px solid #aaa;
  padding: 10px;
  border-radius: 10px;
}
</style>
