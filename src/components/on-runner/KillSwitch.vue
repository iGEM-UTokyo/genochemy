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
const { runnerOutputs, registerOutput, unregisterOutput, kill } = store;

const { isRunning, currentRunner } = toRefs(store);
watch(currentRunner, () => {
  convergeCount = 0;
  prevOutput = 0;
});

registerOutput("protein-KillSwitch");
onUnmounted(() => {
  unregisterOutput("protein-KillSwitch");
});

let requestAnimationFrameId: number | null = null;
let convergeCount = 0;
let prevOutput = 0;
function tick() {
  requestAnimationFrameId = null;
  if (!isRunning.value) return;
  const p = 1 - Math.exp(-runnerOutputs["protein-KillSwitch"] * 0.007);
  if (p >= 0.001) {
    const rand = Math.random();
    if (rand <= p || convergeCount === 50) {
      kill();
    }
    if (Math.abs(runnerOutputs["protein-KillSwitch"] - prevOutput) <= 0.0001) {
      convergeCount++;
    }
  }
  prevOutput = runnerOutputs["protein-KillSwitch"];
  requestAnimationFrameId = requestAnimationFrame(tick);
}

watch(isRunning, () => {
  if (isRunning.value && requestAnimationFrameId === null) {
    tick();
  }
});
if (isRunning.value && requestAnimationFrameId === null) {
  tick();
}
</script>
