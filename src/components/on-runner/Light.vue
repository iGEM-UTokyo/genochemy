<template>
  <img
    class="light"
    width="70"
    src="/runner/light-off.svg"
    :class="{ active: !light }"
  />
  <img
    class="light"
    width="70"
    src="/runner/light-on-blue.svg"
    :class="{ active: light }"
  />
</template>

<script lang="ts">
export default {
  name: "Light",
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { useStore } from "@/store";

const { runnerOutputs, registerOutput, UnregisterOutput } = useStore();

const outputName = "blue-light";
registerOutput(outputName);
onUnmounted(() => {
  UnregisterOutput(outputName);
});

const light = computed(() => runnerOutputs[outputName] === 1);
</script>

<style scoped>
.light {
  position: absolute;
  top: 50px;
  left: 50px;
  pointer-events: none;
  display: none;
}
.active {
  display: block;
}
</style>
