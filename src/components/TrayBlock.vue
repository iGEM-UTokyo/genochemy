<template>
  <div @mousedown="down" @touchstart="down" ref="block">
    <img :src="props.detail.imageSrc" />
    <span>{{ props.detail.displayName ?? props.blockName }}</span>
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
import { BlockDesignDetail } from "@/utils/block-designs";

const props = defineProps<{
  detail: BlockDesignDetail;
  blockName: string;
}>();

const block: Ref<HTMLElement | null> = ref(null);
const { addTempBlock } = useStore();
const down = () => {
  if (block.value !== null) {
    const boundingRect = block.value.getBoundingClientRect();
    addTempBlock(new props.detail.blockClass(), [
      boundingRect.x,
      boundingRect.y + boundingRect.height,
    ]);
  }
};
</script>
