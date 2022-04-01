<template>
  <div @mousedown="down" @mouseup="up" ref="snakeRef" :style="style">
    <Block
      v-for="block in props.snake.blocks"
      :key="block.uuid"
      :block="block" />
    <teleport to=".program">
      <BindGuide
        v-if="currentBindGuide !== null"
        :positions="currentBindGuide" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Snake } from '@/utils/snake'
import { useStore } from '../store'
import Block from '@/components/Block.vue'
import BindGuide from '@/components/BindGuide.vue'
import { Ref, ref, defineProps, computed, StyleValue, ComputedRef } from 'vue';
import { Vector2 } from '@/utils/block';

const props = defineProps<{
  snake: Snake
}>()

const snakeRef: Ref<HTMLElement | null> = ref(null)
const { updateSnake, snakes } = useStore()
// non-reactive. updated on mousedown
let prevAnchors: { pos: Vector2, uuid: string }[] = []
// non-reactive. updated on mousedown
let nextAnchors: { pos: Vector2, uuid: string }[] = []
const down = () => {
  window.addEventListener('mousemove', move)
  prevAnchors = []
  nextAnchors = []
  for (let snake of Object.values(snakes)) {
    prevAnchors.push({ pos: snake.anchorPrev, uuid: snake.uuid })
    nextAnchors.push({ pos: snake.anchorNext, uuid: snake.uuid })
  }
}

const anchorPrev = computed(() => props.snake.anchorPrev)
const style: ComputedRef<StyleValue> = computed(() => ({
  position: 'absolute',
  top: `${anchorPrev.value[1] - (snakeRef.value ? snakeRef.value.clientHeight : 0)}px`,
  left: `${anchorPrev.value[0]}px`,
}))

let currentBindUUID: string | null = null
const currentBindGuide: Ref<[Vector2, Vector2] | null> = ref(null)
const move = (event: MouseEvent) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.snake.anchorPrev[0] += event.movementX
  // eslint-disable-next-line vue/no-mutating-props
  props.snake.anchorPrev[1] += event.movementY
  let hasSet = false
  const _next = props.snake.anchorNext
  for (let prevAnchor of prevAnchors) {
    if (prevAnchor.uuid === props.snake.uuid) continue
    const distance = (prevAnchor.pos[0] - _next[0]) ** 2 + (prevAnchor.pos[1] - _next[1]) ** 2
    if (distance <= 50 ** 2) {
      currentBindUUID = prevAnchor.uuid
      currentBindGuide.value = [prevAnchor.pos, _next]
      hasSet = true
    }
  }
  const _prev = anchorPrev.value
  for (let nextAnchor of nextAnchors) {
    if (nextAnchor.uuid === props.snake.uuid) continue
    const distance = (nextAnchor.pos[0] - _prev[0]) ** 2 + (nextAnchor.pos[1] - _prev[1]) ** 2
    if (distance <= 50 ** 2) {
      currentBindUUID = nextAnchor.uuid
      currentBindGuide.value = [nextAnchor.pos, _prev]
      hasSet = true
    }
  }
  if (!hasSet) {
    currentBindUUID = null
    currentBindGuide.value = null
  }
}
const up = () => {
  window.removeEventListener('mousemove', move)
  currentBindGuide.value = null
  const newSnake = Object.assign(Object.create(Object.getPrototypeOf(props.snake)), props.snake) as Snake
  newSnake.anchorPrev = anchorPrev.value
  updateSnake(newSnake)
}

// on setup, mouse is down
down()
</script>
