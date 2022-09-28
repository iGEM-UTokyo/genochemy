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
    src="/runner/light-on-red.svg"
    :class="{ active: light }"
  />
</template>

<script lang="ts">
export default {
  name: "RedLight",
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { useStore } from "@/store";

const { runnerOutputs, registerOutput, unregisterOutput } = useStore();

const outputName = "red-light";
registerOutput(outputName);
onUnmounted(() => {
  unregisterOutput(outputName);
});

const light = computed(() => runnerOutputs[outputName] === 1);
</script>

<style scoped>
.light {
  position: absolute;
  top: 50px;
  left: 120px;
  pointer-events: none;
  display: none;
}
.active {
  display: block;
}
</style>
