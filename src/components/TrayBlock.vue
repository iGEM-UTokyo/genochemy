<template>
  <div
    @mousedown="down"
    @touchstart="down"
    ref="blockElem"
    :style="{ transform: `translateY(${props.block.design.bottomAnchor}px)` }"
  >
    <svg
      :width="props.block.design.width"
      :height="
        props.block.design.height + (props.block.design.bottomAnchor ?? 0)
      "
    >
      <g :transform="`translate(0, ${props.block.design.height})`">
        <BlockVue :x="0" :y="0" :block="props.block" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
div {
  position: relative;
  display: flex; /* for height-adjustment */
  touch-action: none;
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
import { useStore } from "../store";
import { Ref, ref, defineProps } from "vue";
import BlockVue from "@/components/Block.vue";
import type { Block } from "@/utils/block";

const props = defineProps<{
  block: Block;
}>();

const blockElem: Ref<HTMLElement | null> = ref(null);
const { addTempBlock } = useStore();
const down = () => {
  if (blockElem.value !== null) {
    const boundingRect = blockElem.value.getBoundingClientRect();
    addTempBlock(props.block, [
      boundingRect.x,
      boundingRect.y + boundingRect.height - props.block.design.bottomAnchor,
    ]);
  }
};
</script>
