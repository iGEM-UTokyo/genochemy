<template>
  <div @mousedown="down" @touchstart="down" ref="block">
    <img :src="props.detail.imageSrc" />
    <span>{{ props.detail.displayName || props.blockName }}</span>
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
  left: 20px;
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
const { addBlock } = useStore();
const down = () => {
  if (block.value !== null) {
    // todo: throw exception
    if (!block.value.parentElement) return;
    addBlock(new props.detail.blockClass(), [
      block.value.clientLeft,
      block.value.offsetTop +
        block.value.offsetHeight -
        block.value.parentElement.scrollTop,
    ]);
  }
};
</script>
