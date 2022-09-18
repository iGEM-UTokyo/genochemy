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
  if (ex - sx < -20) {
    if (Math.abs(ey - sy) < 20) {
      const my = (sy + ey) / 2;
      return `M${sx},${sy}
        Q${sx + 20},${sy} ${sx + 20},${sy + 20}
        C${sx + 20},${my + 100} ${ex - 20},${my + 100} ${ex - 20},${ey + 20}
        Q${ex - 20},${ey} ${ex},${ey}`;
    }
    const my1 = (sy * 5 + ey) / 6;
    const my2_1 = (sy + ey * 3) / 4;
    const my2_2 = (sy * 3 + ey) / 4;
    const my3 = (sy + ey * 5) / 6;
    return `M${sx},${sy}
      Q${sx + 20},${sy} ${sx + 20},${my1}
      C${sx + 20},${my2_1} ${ex - 20},${my2_2} ${ex - 20},${my3}
      Q${ex - 20},${ey} ${ex},${ey}`;
  }
  const mx = (sx + ex) / 2;
  return `M${sx},${sy} C${Math.max(mx, sx + 20)},${sy} ${Math.min(
    mx,
    ex - 20
  )},${ey} ${ex},${ey}`;
});
</script>
