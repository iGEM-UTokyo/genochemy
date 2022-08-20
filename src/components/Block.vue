<template>
  <!-- <div :style="divStyle"> -->
  <g>
    <image
      ref="blockImageRef"
      :href="src"
      :width="props.block.width"
      :x="x"
      :y="props.anchorTopLeft ? 0 : -(blockImageRef?.getBBox().height ?? 0)"
    />
    <text
      :x="props.x + 10"
      :y="
        (props.anchorTopLeft ? blockImageRef?.getBBox().height ?? 0 : 0) +
        props.y -
        9
      "
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
import { overlap } from "../utils/snake";
import {
  defineProps,
  computed,
  StyleValue,
  ComputedRef,
  Ref,
  ref,
  watch,
} from "vue";
import { blockDesignDetails } from "@/utils/block-designs";

const props = defineProps<{
  x: number;
  y: number;
  block: Block;
  anchorTopLeft?: boolean;
}>();
const src = computed(() => blockDesignDetails[props.block.name].imageSrc);
const displayName = computed(
  () => blockDesignDetails[props.block.name].displayName ?? props.block.name
);

const blockImageRef: Ref<SVGGraphicsElement | null> = ref(null);

const divStyle: ComputedRef<StyleValue> = computed(() => ({
  width: `${props.block.width - overlap}px`,
}));
</script>

<style scoped>
text {
  user-select: none;
}
</style>
