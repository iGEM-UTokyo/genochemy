<template>
  <div class="light" :style="{ backgroundColor: lightRGBA }" />
</template>

<script lang="ts">
export default {
  name: "Fluorescence",
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { useStore } from "@/store";

const { runnerOutputs, registerOutput, unregisterOutput } = useStore();

type Color = [number, number, number];
const outputNames = ["protein-GFP", "protein-mCherry"] as const;
for (const name of outputNames) {
  registerOutput(name);
}
onUnmounted(() => {
  for (const name of outputNames) {
    unregisterOutput(name);
  }
});

const colors: { [key in typeof outputNames[number]]: Color } = {
  "protein-GFP": [0, 255, 0],
  "protein-mCherry": [255, 9, 91],
};
const lightRGBA = computed(() => {
  const color = [0, 0, 0];
  let sum = 0;
  let max = 0;
  for (const name of outputNames) {
    sum += runnerOutputs[name];
    max = Math.max(max, runnerOutputs[name]);
    for (let i = 0; i < 3; i++) {
      color[i] += colors[name][i] * runnerOutputs[name];
    }
  }
  if (sum > 0) {
    for (let i = 0; i < 3; i++) {
      color[i] /= sum;
    }
  }
  const opacity = max / (0.5 + max);
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
});
</script>

<style scoped>
.light {
  position: absolute;
  width: 37px;
  height: 88px;
  top: 68px;
  left: 230px;
  /* background-color: red;
  opacity: 0.5; */
  border-radius: 50px;
}
</style>
