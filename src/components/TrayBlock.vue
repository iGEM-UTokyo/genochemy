<template>
  <div
    class="tray-block"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointerenter="pointerenter"
    @pointerleave="pointerleave"
    ref="blockElem"
    :style="{ transform: `translateY(${block.design.bottomAnchor}px)` }"
  >
    <tooltip :rect="blockRect" :show="showDescription">
      <block-description :block="block" />
    </tooltip>
    <svg
      :width="block.design.width"
      :height="block.design.height + block.design.bottomAnchor"
    >
      <g :transform="`translate(0, ${block.design.height})`">
        <BlockVue
          :x="0"
          :y="0"
          :block="block"
          :update-block="(updater) => updater(block)"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.tray-block {
  position: relative;
  display: flex; /* for height-adjustment */
  touch-action: none;
  user-select: none;
}
</style>

<script setup lang="ts">
import { useStore } from "../store";
import { Ref, ref, defineProps, computed } from "vue";
import BlockVue from "@/components/Block.vue";
import Tooltip from "@/components/tooltip/Tooltip.vue";
import BlockDescription from "./tooltip/BlockDescription.vue";
import type { FinalBlock } from "@/utils/block";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  blockClass: FinalBlock;
}>();

const blockElem: Ref<HTMLElement | null> = ref(null);
const block = ref(new props.blockClass());
const { addTempBlock } = useStore();
let isDown = false;
const down = () => {
  isDown = true;
};
const move = (e: PointerEvent) => {
  if (
    isDown &&
    blockElem.value !== null &&
    Math.abs(e.movementX ** 2 + e.movementY ** 2) > 0.1
  ) {
    const boundingRect = blockElem.value.getBoundingClientRect();
    addTempBlock(block.value, [
      boundingRect.x,
      boundingRect.y + boundingRect.height - block.value.design.bottomAnchor,
    ]);
    block.value = new props.blockClass();
    isDown = false;
  }
};
const up = () => {
  isDown = false;
};
const blockRect = computed(
  () => blockElem.value?.getBoundingClientRect() ?? null
);
const showDescription = ref(false);
let enterTimeoutId: number | null = null;
let leaveTimeoutId: number | null = null;
const pointerenter = () => {
  if (leaveTimeoutId !== null) {
    clearTimeout(leaveTimeoutId);
    leaveTimeoutId = null;
  }
  enterTimeoutId = setTimeout(() => {
    enterTimeoutId = null;
    showDescription.value = true;
  }, 300);
};
const pointerleave = () => {
  if (enterTimeoutId !== null) {
    clearTimeout(enterTimeoutId);
    enterTimeoutId = null;
  }
  leaveTimeoutId = setTimeout(() => {
    leaveTimeoutId = null;
    showDescription.value = false;
  }, 100);
};
</script>
