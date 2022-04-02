import { defineStore } from 'pinia'
import { reactive, Ref, ref, watch } from 'vue'
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
  const grabStart = (grabbingBlock: BlockWithUUID) => {
    grabbing.value = true
  }
  const grabEnd = () => {
    grabbing.value = false
  }
  return { snakes, addBlock, updateSnake, mergeToTail, mergeToHead }
})
