<template>
  <div
    class="snake"
    ref="snakeRef"
    :style="style">
    <Block
      v-for="block in props.snake.blocks"
      @mousedown="down(block.uuid)"
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
import { Ref, ref, reactive, defineProps, computed, StyleValue, ComputedRef, toRaw, watch } from 'vue';
import { BlockWithUUID, Vector2 } from '@/utils/block';
import { DeepReadonly } from '@/utils/deep-readonly'

const props = defineProps<{
  snake: DeepReadonly<Snake>
}>()

let currentSnake = ref(Snake.copy(props.snake))
// props.snake: not working
watch(props, () => {
  currentSnake.value = Snake.copy(props.snake)
}, { flush: 'post' })
const snakeRef: Ref<HTMLElement | null> = ref(null)
const { updateSnake, snakes, mergeToTail, mergeToHead, splitHead, splitTail } = useStore()
// non-reactive. updated on mousedown
let tailAnchors: { pos: Readonly<Vector2>, uuid: string }[] = []
// non-reactive. updated on mousedown
let headAnchors: { pos: Readonly<Vector2>, uuid: string }[] = []
let grabbingBlockUUID: string | null = null
let hasSplitted = false
const down = (blockUUID: string) => {
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
  tailAnchors = []
  headAnchors = []
  grabbingBlockUUID = blockUUID
  for (let snake of Object.values(snakes)) {
    tailAnchors.push({ pos: snake.anchorTail, uuid: snake.uuid })
    headAnchors.push({ pos: snake.anchorNext, uuid: snake.uuid })
  }
}

const anchorTail = computed(() => currentSnake.value.anchorTail)
const style: ComputedRef<StyleValue> = computed(() => {
  return {
    top: `${anchorTail.value[1] - (snakeRef.value ? snakeRef.value.clientHeight : 0)}px`,
    left: `${anchorTail.value[0]}px`,
  }
})

const currentBindInfo: Ref<{
  bindGuide: [Readonly<Vector2>, Readonly<Vector2>],
  toUUID: string,
  mode: 'head' | 'tail'
} | null> = ref(null)
const move = (event: MouseEvent) => {
  if (!hasSplitted && grabbingBlockUUID !== null && event.shiftKey) {
    if (event.movementX < 0) {
      hasSplitted = true
      updateSnake(Snake.copy(currentSnake.value))
      splitHead(currentSnake.value.uuid, grabbingBlockUUID)
    } else if (event.movementX > 0) {
      hasSplitted = true
      updateSnake(Snake.copy(currentSnake.value))
      splitTail(currentSnake.value.uuid, grabbingBlockUUID)
    }
  }
  currentSnake.value.anchorTail[0] += event.movementX
  currentSnake.value.anchorTail[1] += event.movementY
  let hasSet = false
  const _head = currentSnake.value.anchorNext
  for (let tailAnchor of tailAnchors) {
    if (tailAnchor.uuid === currentSnake.value.uuid) continue
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
    if (headAnchor.uuid === currentSnake.value.uuid) continue
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
  window.removeEventListener('mouseup', up)
  grabbingBlockUUID = null
  hasSplitted = false

  if (currentBindInfo.value !== null) {
    if (currentBindInfo.value.mode === 'head') {
      mergeToHead(currentSnake.value.uuid, currentBindInfo.value.toUUID)
    } else {
      mergeToTail(currentSnake.value.uuid, currentBindInfo.value.toUUID)
    }
    currentBindInfo.value = null
  } else {
    updateSnake(Snake.copy(currentSnake.value))
  }
}

if (currentSnake.value.fromTray) {
  down(currentSnake.value.blocks[0].uuid)
}
</script>

<style scoped>
.snake {
  position: absolute;
  display: flex;
  align-items: flex-end;
}
</style>