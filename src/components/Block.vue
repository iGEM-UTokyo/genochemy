<template>
  <div :style="divStyle">
    <img :src="src" :width="props.block.width" />
    <span>{{ displayName }}</span>
  </div>
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
  left: 20px;
  bottom: 3px;
  font-size: 16px;
}
</style>

<script setup lang="ts">
import { Block } from "../utils/block";
import { overlap } from "../utils/snake";
import { defineProps, computed, StyleValue, ComputedRef } from "vue";
import { blockDesignDetails } from "@/utils/block-designs";

const props = defineProps<{
  block: Block;
}>();
const src = computed(() => blockDesignDetails[props.block.name].imageSrc);
const displayName = computed(
  () => blockDesignDetails[props.block.name].displayName || props.block.name
);

const divStyle: ComputedRef<StyleValue> = computed(() => ({
  width: `${props.block.width - overlap}px`,
}));
</script>
