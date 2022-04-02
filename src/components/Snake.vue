<template>
  <div
    class="snake"
    @mousedown="down"
    @mouseup="up"
    ref="snakeRef"
    :style="style">
    <Block
      v-for="block in props.snake.blocks"
      :key="block.uuid"
      :block="block" />
    <teleport to=".program">
      <BindGuide
        v-if="currentBindInfo !== null"
        :positions="currentBindInfo.bindGuide" />
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
const { updateSnake, snakes, mergeToTail, mergeToHead } = useStore()
// non-reactive. updated on mousedown
let tailAnchors: { pos: Vector2, uuid: string }[] = []
// non-reactive. updated on mousedown
let headAnchors: { pos: Vector2, uuid: string }[] = []
const down = () => {
  window.addEventListener('mousemove', move)
  tailAnchors = []
  headAnchors = []
  for (let snake of Object.values(snakes)) {
    tailAnchors.push({ pos: snake.anchorTail, uuid: snake.uuid })
    headAnchors.push({ pos: snake.anchorNext, uuid: snake.uuid })
  }
}

const anchorTail = computed(() => props.snake.anchorTail)
const style: ComputedRef<StyleValue> = computed(() => ({
  top: `${anchorTail.value[1] - (snakeRef.value ? snakeRef.value.clientHeight : 0)}px`,
  left: `${anchorTail.value[0]}px`,
}))

const currentBindInfo: Ref<{
  bindGuide: [Vector2, Vector2],
  toUUID: string,
  mode: 'head' | 'tail'
} | null> = ref(null)
const move = (event: MouseEvent) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.snake.anchorTail[0] += event.movementX
  // eslint-disable-next-line vue/no-mutating-props
  props.snake.anchorTail[1] += event.movementY
  let hasSet = false
  const _head = props.snake.anchorNext
  for (let tailAnchor of tailAnchors) {
    if (tailAnchor.uuid === props.snake.uuid) continue
    const distance = (tailAnchor.pos[0] - _head[0]) ** 2 + (tailAnchor.pos[1] - _head[1]) ** 2
    if (distance <= 50 ** 2) {
      currentBindInfo.value = {
        bindGuide: [tailAnchor.pos, _head],
        toUUID: tailAnchor.uuid,
        mode: 'tail',
      }
      hasSet = true
    }
  }
  const _tail = anchorTail.value
  for (let headAnchor of headAnchors) {
    if (headAnchor.uuid === props.snake.uuid) continue
    const distance = (headAnchor.pos[0] - _tail[0]) ** 2 + (headAnchor.pos[1] - _tail[1]) ** 2
    if (distance <= 50 ** 2) {
      currentBindInfo.value = {
        bindGuide: [headAnchor.pos, _tail],
        toUUID: headAnchor.uuid,
        mode: 'head'
      }
      hasSet = true
    }
  }
  if (!hasSet) {
    currentBindInfo.value = null
  }
}
const up = () => {
  window.removeEventListener('mousemove', move)
  if (currentBindInfo.value !== null) {
    if (currentBindInfo.value.mode === 'head') {
      mergeToHead(props.snake.uuid, currentBindInfo.value.toUUID)
    } else {
      mergeToTail(props.snake.uuid, currentBindInfo.value.toUUID)
    }
    currentBindInfo.value = null
  } else {
    const newSnake = Object.assign(Object.create(Object.getPrototypeOf(props.snake)), props.snake) as Snake
    newSnake.anchorTail = anchorTail.value
    updateSnake(newSnake)
  }
}

// on setup, mouse is down
down()
</script>

<style scoped>
.snake {
  position: absolute;
  display: flex;
  align-items: flex-end;
}
</style>
