<template>
  <img class="light" width="50" :src="src" />
</template>

<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { useStore } from "@/store";

const { runnerOutputs, registerOutput, UnregisterOutput } = useStore();

const outputName = "blue-light";
registerOutput(outputName);
onUnmounted(() => {
  UnregisterOutput(outputName);
});

const src = computed(() => {
  if (runnerOutputs[outputName] === 1) {
    return "/runner/light-on-blue.svg";
  }
  return "/runner/light-off.svg";
});
</script>

<style scoped>
.light {
  position: absolute;
  top: 50px;
  left: 50px;
}
</style>
