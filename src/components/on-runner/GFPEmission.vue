<template>
  <div class="light" :style="{ backgroundColor: lightRGBA }" />
</template>

<script lang="ts">
export default {
  name: "GFPEmission",
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { useStore } from "@/store";

const { runnerOutputs, registerOutput, UnregisterOutput } = useStore();

const outputName = "protein-GFP";
registerOutput(outputName);
onUnmounted(() => {
  UnregisterOutput(outputName);
});

const GFPColor = [0, 255, 0];
const lightRGBA = computed(
  () =>
    `rgba(${GFPColor[0]}, ${GFPColor[1]}, ${GFPColor[2]}, ${Math.min(
      runnerOutputs[outputName] * 0.8,
      0.8
    )})`
);
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
