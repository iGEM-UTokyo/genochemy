<template>
  <div
    @mousedown="down"
    @touchstart="down"
    ref="blockElem"
    :style="{ transform: `translateY(${block.design.bottomAnchor}px)` }"
  >
    <svg
      :width="block.design.width"
      :height="block.design.height + block.design.bottomAnchor"
    >
      <g :transform="`translate(0, ${block.design.height})`">
        <BlockVue :x="0" :y="0" :block="block" />
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
import type { FinalBlock } from "@/utils/block";

const props = defineProps<{
  blockClass: FinalBlock;
}>();

const blockElem: Ref<HTMLElement | null> = ref(null);
const block = ref(new props.blockClass());
const { addTempBlock } = useStore();
const down = () => {
  if (blockElem.value !== null) {
    const boundingRect = blockElem.value.getBoundingClientRect();
    addTempBlock(block.value, [
      boundingRect.x,
      boundingRect.y + boundingRect.height - block.value.design.bottomAnchor,
    ]);
    block.value = new props.blockClass();
  }
};
</script>
