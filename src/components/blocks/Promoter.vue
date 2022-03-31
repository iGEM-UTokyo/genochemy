<template>
  <div @mousedown="down" @mouseup="up" ref="block" :style="style">
    <img src="@/assets/blocks/promoter.svg" />
    <span>T7 promoter</span>
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
import { PromoterBlock, Block, BlockWithUUID } from '../../utils/block'
import { useStore } from '../../store'
import { Ref, ref, withDefaults, defineProps, computed } from 'vue';

const props = withDefaults(defineProps<{
  showcase: boolean,
  block: Block,
}>(), {
  showcase: false
})

const block: Ref<HTMLElement | null> = ref(null)
const { addBlock, updateBlock } = useStore()
const down = () => {
  if (props.showcase) {
    if (block.value !== null) {
      // todo: throw exception
      addBlock(new PromoterBlock({
        promoterName: 'T7 promoter',
        location: [block.value.clientLeft, block.value.clientTop]
      }))
    }
  } else {
    window.addEventListener('mousemove', move)
  }
}

const top = ref(0)
const left = ref(0)
const style = computed(() => props.showcase ? {} : {
  position: 'absolute',
  top: `${top.value}px`,
  left: `${left.value}px`,
})
if (!props.showcase) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  top.value = props.block.location[1]
  // eslint-disable-next-line vue/no-setup-props-destructure
  left.value = props.block.location[0]
}

const move = (event: MouseEvent) => {
  top.value += event.movementY
  left.value += event.movementX
}
if (!props.showcase) {
  window.addEventListener('mousemove', move)
}
const up = () => {
  if (!props.showcase) {
    window.removeEventListener('mousemove', move)
    const newBlock = Object.assign(Object.create(Object.getPrototypeOf(props.block)), props.block) as BlockWithUUID
    newBlock.location = [left.value, top.value]
    updateBlock(newBlock)
  }
}
</script>

