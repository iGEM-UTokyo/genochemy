<template>
  <div @mousedown="down" ref="block">
    <img :src="props.detail.imageSrc" />
    <span>{{ props.detail.displayName || props.blockName }}</span>
  </div>
</template>

<style scoped>
div {
  position: relative;
  display: flex /* for height-adjustment */
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
import { useStore } from '../store'
import { Ref, ref, defineProps } from 'vue';
import { BlockDesignDetail } from '@/utils/block-designs';

const props = defineProps<{
  detail: BlockDesignDetail,
  blockName: string
}>()

const block: Ref<HTMLElement | null> = ref(null)
const { addBlock } = useStore()
const down = () => {
  if (block.value !== null) {
    // todo: throw exception
    addBlock(new props.detail.blockClass(),
      [block.value.offsetLeft, block.value.offsetTop + block.value.offsetHeight])
  }
}
</script>
