<template>
  <div class="drug-a">
    薬剤A:
    <input
      class="drug"
      type="range"
      v-model="drug"
      @change="update"
      min="0"
      max="1"
      step="0.01"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store";
const { updateDrug, drug: _drug } = useStore();
const drug = ref(_drug);
const update = () => {
  updateDrug(drug.value);
};
</script>

<style scoped>
.drug-a {
  display: flex;
}
.drug {
  flex: 1;
}
</style>
