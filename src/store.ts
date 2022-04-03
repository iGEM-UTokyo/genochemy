import { defineStore } from 'pinia'
import { isReadonly, reactive, readonly, Ref, ref, watch } from 'vue'
import { Block, BlockWithUUID, Vector2 } from './utils/block'
import { Snake } from './utils/snake'
import { v4 as uuidv4 } from 'uuid'

function setUUID(block: Block, uuid: string): asserts block is BlockWithUUID {
  block.uuid = uuid
}
export const useStore = defineStore('main', () => {
  const snakes: Record<string, Snake> = reactive({})
  const grabbing = ref(false)
  const addBlock = (block: Block, anchorTail: Vector2) => {
    setUUID(block, uuidv4())
    const snakeUUID = uuidv4()
    snakes[snakeUUID] = new Snake({
      uuid: snakeUUID,
      blocks: [block],
      anchorTail,
      fromTray: true
    })
  }
  const updateSnake = (snake: Snake) => {
    if (!snakes[snake.uuid]) {
      console.error(`snake uuid is invalid: ${snake.uuid}`)
      return
    }
    snakes[snake.uuid] = snake
  }
  const mergeToTail = (snakeUUID: string, toUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`)
      return
    }
    if (!snakes[toUUID]) {
      console.error(`snake uuid is invalid: ${toUUID}`)
      return
    }
    snakes[toUUID].appendToTail(snakes[snakeUUID])
    delete snakes[snakeUUID]
  }
  const mergeToHead = (snakeUUID: string, toUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`)
      return
    }
    if (!snakes[toUUID]) {
      console.error(`snake uuid is invalid: ${toUUID}`)
      return
    }
    snakes[toUUID].appendToHead(snakes[snakeUUID])
    delete snakes[snakeUUID]
  }
  const splitHead = (snakeUUID: string, blockUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`)
      return
    }
    const newSnake = snakes[snakeUUID].splitHead(blockUUID)
    if (newSnake) {
      snakes[newSnake.uuid] = newSnake
    }
  }
  const splitTail = (snakeUUID: string, blockUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`)
      return
    }
    const newSnake = snakes[snakeUUID].splitTail(blockUUID)
    if (newSnake) {
      snakes[newSnake.uuid] = newSnake
    }
  }
  const grabStart = (grabbingBlock: BlockWithUUID) => {
    grabbing.value = true
  }
  const grabEnd = () => {
    grabbing.value = false
  }
  return {
    snakes: readonly(snakes),
    addBlock,
    updateSnake,
    mergeToTail,
    mergeToHead,
    splitHead,
    splitTail,
  }
})
