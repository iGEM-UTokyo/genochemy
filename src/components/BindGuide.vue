<template>
  <div :style="style" class="bind-guide">
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <line x1="0" y1="0" x2="100" y2="100" stroke="black" stroke-width="2" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { Vector2 } from "@/utils/block";
import { StyleValue, defineProps, ComputedRef, computed } from "vue";

const props = defineProps<{
  positions: [Readonly<Vector2>, Readonly<Vector2>];
}>();

const style: ComputedRef<StyleValue> = computed(() => {
  const widthBase = props.positions[0][0] - props.positions[1][0];
  const heightBase = props.positions[0][1] - props.positions[1][1];
  const result: StyleValue = {
    top: `${Math.min(props.positions[0][1], props.positions[1][1]) - 15}px`,
    left: `${Math.min(props.positions[0][0], props.positions[1][0])}px`,
    width: `${Math.abs(widthBase)}px`,
    height: `${Math.abs(heightBase)}px`,
  };
  if (widthBase * heightBase < 0) {
    result["transform"] = "scaleX(-1)";
  }
  return result;
});
</script>

<style scoped>
.bind-guide {
  position: absolute;
  display: flex;
}
.bind-guide svg {
  width: 100%;
  height: 100%;
}
</style>
