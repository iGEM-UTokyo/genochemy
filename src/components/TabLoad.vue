<template>
  <div class="tab-content">
    <button @click="load">{{ t("load.loadUTokyo2022Project") }}</button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import questions from "@/utils/questions";
import importJson from "@/utils/importer";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { addSnake } = useStore();

function load() {
  const snakes = importJson(questions[8].answer!);
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
