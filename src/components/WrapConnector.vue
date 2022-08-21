<template>
  <path :d="d" stroke="gray" fill="none" stroke-width="2" />
</template>

<script setup lang="ts">
import { Vector2 } from "@/utils/block";
import { DeepReadonly } from "@/utils/deep-readonly";
import { computed, defineProps } from "vue";

const props = defineProps<{
  positions: DeepReadonly<[Vector2, Vector2]>;
}>();

const d = computed(() => {
  const sx = props.positions[0][0];
  const sy = props.positions[0][1] - 15;
  const ex = props.positions[1][0];
  const ey = props.positions[1][1] - 15;
  const mx = (sx + ex) / 2;
  return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`;
});
</script>
