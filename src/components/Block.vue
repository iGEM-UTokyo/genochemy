<template>
  <!-- <div :style="divStyle"> -->
  <g>
    <image
      :href="src"
      :width="props.block.design.width"
      :x="x"
      :y="props.anchorTopLeft ? 0 : -props.block.design.height"
    />
    <text
      :x="props.x + 10"
      :y="(props.anchorTopLeft ? props.block.design.height : 0) + props.y - 9"
      fill="white"
      >{{ displayName }}</text
    >
  </g>
</template>

<style scoped>
div {
  position: relative;
  display: flex; /* for height-adjustment */
  user-select: none;
}
img {
  pointer-events: none;
}
span {
  color: white;
  position: absolute;
  left: 15px;
  bottom: 5px;
  font-size: 16px;
}
</style>

<script setup lang="ts">
import { Block } from "../utils/block";
import { defineProps, computed } from "vue";

const props = defineProps<{
  x: number;
  y: number;
  block: Block;
  anchorTopLeft?: boolean;
}>();
const src = computed(() => props.block.design.imageSrc);
const displayName = computed(() => props.block.design.displayName);
</script>

<style scoped>
text {
  user-select: none;
}
</style>
