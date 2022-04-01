<template>
  <div @mousedown="down" ref="block">
    <img :src="props.src" />
    <span>{{ props.blockName }}</span>
  </div>
</template>

<style scoped>
div {
  position: relative;
}
img {
  pointer-events: none;
}
span {
  color: white;
  position: absolute;
  left: 20px;
  bottom: 10px;
  font-size: 16px;
}
</style>

<script setup lang="ts">
import { FinalBlock } from '../utils/block'
import { useStore } from '../store'
import { Ref, ref, defineProps } from 'vue';

const props = defineProps<{
  blockName: string,
  src: string,
  blockClass: FinalBlock
}>()

const block: Ref<HTMLElement | null> = ref(null)
const { addBlock } = useStore()
const down = () => {
  if (block.value !== null) {
    // todo: throw exception
    addBlock(new props.blockClass(),
      [block.value.offsetLeft, block.value.offsetTop + block.value.offsetHeight])
  }
}
</script>
