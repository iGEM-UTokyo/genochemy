<template>
  <div @mousedown="down" @mouseup="up" ref="block" :style="style">
    <img :src="src" />
    <span>{{ props.block.name }}</span>
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
import { PromoterBlock, Block, BlockWithUUID } from '../utils/block'
import { useStore } from '../store'
import { Ref, ref, withDefaults, defineProps, computed, StyleValue, ComputedRef } from 'vue';
import { blockDesignDetails } from '@/utils/block-designs';

const props = defineProps<{
  block: Block,
}>()
const src = computed(() => blockDesignDetails[props.block.name].imageSrc)
const block: Ref<HTMLElement | null> = ref(null)
const { updateBlock } = useStore()
const down = () => {
  window.addEventListener('mousemove', move)
}

const top = ref(0)
const left = ref(0)
const style: ComputedRef<StyleValue> = computed(() => props.showcase ? {} : {
  position: 'absolute',
  top: `${top.value}px`,
  left: `${left.value}px`,
})
// eslint-disable-next-line vue/no-setup-props-destructure
top.value = props.block.location[1]
// eslint-disable-next-line vue/no-setup-props-destructure
left.value = props.block.location[0]

const move = (event: MouseEvent) => {
  top.value += event.movementY
  left.value += event.movementX
}
window.addEventListener('mousemove', move)
const up = () => {
  window.removeEventListener('mousemove', move)
  const newBlock = Object.assign(Object.create(Object.getPrototypeOf(props.block)), props.block) as BlockWithUUID
  newBlock.location = [left.value, top.value]
  updateBlock(newBlock)
}
</script>

