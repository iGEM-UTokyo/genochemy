<template>
  <line
    :x1="props.positions[0][0]"
    :y1="props.positions[0][1] - 15"
    :x2="props.positions[1][0] + 7"
    :y2="props.positions[1][1] - 15"
    stroke="gray"
    stroke-width="2"
    stroke-dasharray="4"
  />
</template>

<script setup lang="ts">
import { Vector2 } from "@/utils/block";
import { defineProps } from "vue";

// [head, tail]
const props = defineProps<{
  positions: [Readonly<Vector2>, Readonly<Vector2>];
}>();
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
