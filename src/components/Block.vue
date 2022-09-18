<template>
  <!-- <div :style="divStyle"> -->
  <g>
    <image :href="src" :width="props.block.design.width" :x="props.x" :y="_y" />
    <text :x="props.x + 10" :y="props.y - 9" fill="white">{{
      t(displayName)
    }}</text>
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  x: number;
  y: number;
  block: Block;
}>();
const src = computed(() => props.block.design.imageSrc);
const displayName = computed(() => props.block.design.displayName);
const _y = computed(
  () => -props.block.design.height + props.y + props.block.design.bottomAnchor
);
</script>

<style scoped>
text {
  user-select: none;
}
</style>
