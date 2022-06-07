<template>
  <div class="runner">
    <img src="/runner/bacterium.svg" class="bacterium" />
    <div class="light" :style="{ backgroundColor: lightRGBA }" />
    <input class="drug" type="range" v-model="drug" @change="update" min="0" max="1" step="0.01" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../store";
const { runnerOutputs, updateDrug } = useStore();

const mCherryColor = [208, 25, 187];
const lightRGBA = computed(() => `rgba(${mCherryColor[0]}, ${mCherryColor[1]}, ${mCherryColor[2]}, ${Math.min(runnerOutputs.lightEmission * 0.8, 0.8)})`)
const drug = ref(0);
const update = () => {
  updateDrug(drug.value)
}
</script>

<style scoped>
.runner {
  height: 300px;
  border: 1px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.bacterium {
  height: 200px;
}
.light {
  position: absolute;
  width: 50px;
  height: 100px;
  top: 60px;
  /* background-color: red;
  opacity: 0.5; */
  border-radius: 50px;
}
.drug {
  position: absolute;
  width: 400px;
  bottom: 10px;
}
</style>
