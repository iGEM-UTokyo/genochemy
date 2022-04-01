<template>
  <div @mousedown="down" @mouseup="up" ref="snakeRef" :style="style">
    <Block
      v-for="block in props.snake.blocks"
      :key="block.uuid"
      :block="block" />
  </div>
</template>

<script setup lang="ts">
import { Snake } from '@/utils/snake'
import { useStore } from '../store'
import Block from '@/components/Block.vue'
import { Ref, ref, defineProps, computed, StyleValue, ComputedRef } from 'vue';

const props = defineProps<{
  snake: Snake
}>()

const snakeRef: Ref<HTMLElement | null> = ref(null)
const { updateSnake } = useStore()
const down = () => {
  window.addEventListener('mousemove', move)
}

const bottom = ref(0)
const left = ref(0)
const style: ComputedRef<StyleValue> = computed(() => ({
  position: 'absolute',
  top: `${bottom.value - (snakeRef.value ? snakeRef.value.clientHeight : 0)}px`,
  left: `${left.value}px`,
}))
// eslint-disable-next-line vue/no-setup-props-destructure
bottom.value = props.snake.anchorPrev[1]
// eslint-disable-next-line vue/no-setup-props-destructure
left.value = props.snake.anchorPrev[0]

const move = (event: MouseEvent) => {
  bottom.value += event.movementY
  left.value += event.movementX
}
window.addEventListener('mousemove', move)
const up = () => {
  window.removeEventListener('mousemove', move)
  const newSnake = Object.assign(Object.create(Object.getPrototypeOf(props.snake)), props.snake) as Snake
  newSnake.anchorPrev = [left.value, bottom.value]
  updateSnake(newSnake)
}
</script>
