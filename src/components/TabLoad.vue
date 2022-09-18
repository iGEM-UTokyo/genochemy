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
  const snakes = importJson([
    {
      blocks: [
        "prom-const-1",
        "ctrl-EL222",
        "ctrl-PhyB",
        "ctrl-PIF3",
        "term-1",
      ],
    },
    {
      blocks: [
        "prom-activ-EL222dim",
        "seq-recog-recomb2",
        "meta-recomb1",
        "term-1",
        "seq-recog-recomb2",
        "visi-GFP",
        "term-1",
      ],
    },
    {
      blocks: [
        "prom-activ-PhyBPIF3",
        "seq-recog-recomb1",
        "meta-kill",
        "term-1",
        "seq-recog-recomb1",
        "meta-recomb2",
        "term-1",
      ],
    },
  ]);
  addSnake(...snakes);
}
</script>

<style scoped>
button {
  background-color: white;
  border: 1px solid #aaa;
  padding: 10px;
  border-radius: 10px;
  font-family: inherit;
}
</style>
