<template>
  <div></div>
</template>

<script lang="ts">
export default {
  name: "KillSwitch",
  customOptions: {},
};
</script>

<script setup lang="ts">
import { onUnmounted, toRefs, watch } from "vue";
import { useStore } from "@/store";

const store = useStore();
const { runnerOutputs, registerOutput, UnregisterOutput, kill } = store;

const { isRunning, currentRunner } = toRefs(store);
watch(currentRunner, () => {
  pCount = 0;
});

registerOutput("protein-KillSwitch");
onUnmounted(() => {
  UnregisterOutput("protein-KillSwitch");
});

let requestAnimationFrameId: number | null = null;
const pDetermineThreshold = 0.0065;
let pCount = 0;
function tick() {
  requestAnimationFrameId = null;
  if (!isRunning.value) return;
  const p = 1 - Math.exp(-runnerOutputs["protein-KillSwitch"] * 0.007);
  const rand = Math.random();
  if (rand <= p || pCount === Math.floor(1 / pDetermineThreshold)) {
    kill();
  }
  if (p >= pDetermineThreshold) {
    pCount++;
  }
  requestAnimationFrameId = requestAnimationFrame(tick);
}

watch(isRunning, () => {
  if (isRunning.value && requestAnimationFrameId === null) {
    tick();
  }
});
</script>
