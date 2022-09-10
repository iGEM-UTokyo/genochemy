<template>
  <div class="tab-content">
    <list-box
      :list="proteinNames"
      v-model="activeProteinName"
      class="protein-list"
    />
    <div class="protein-settings" v-if="activeProtein">
      <h3>{{ activeProteinName }}</h3>
      {{ activeProtein.description }}<br />
      mRNA(s):<br />
      <list-box :list="activeProteinMessengerRNAs" />
      <Logger
        v-if="measurableProteins.includes(activeProteinName)"
        :target="`protein-${activeProteinName}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import ListBox from "@/components/ListBox.vue";
import Logger from "./Logger.vue";

const store = useStore();

const measurableProteins = ["mCherry", "GFP"];

const proteinNames = computed(() =>
  store.proteins.map((protein) => protein.name.substring("protein-".length))
);
const activeProteinName = ref("");
const activeProtein = computed(() => {
  if (activeProteinName.value === "") return null;
  const protein = store.proteins.filter(
    (protein) => protein.name === `protein-${activeProteinName.value}`
  );
  if (protein.length !== 1) {
    // throw new Error(`Protein: ${activeProteinName.value} does not exist or duplicates.`)
    return null;
  }
  return protein[0];
});
const activeProteinMessengerRNAs = computed(() => {
  if (activeProtein.value === null) return [];
  return activeProtein.value.messengerRNAs.map((mRNA) => mRNA.name);
});
</script>

<style scoped>
.protein-list {
  width: 100px;
}
.tab-content {
  display: flex;
  align-items: stretch;
}
.protein-settings {
  flex: 1;
  margin-left: 10px;
  overflow-y: auto;
}
h3 {
  margin: 0;
}
</style>
