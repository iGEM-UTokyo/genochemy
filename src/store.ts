import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Block, BlockWithUUID, Vector2 } from './utils/block'
import { Snake } from './utils/snake'
import { v4 as uuidv4 } from 'uuid'

function setUUID(block: Block, uuid: string): asserts block is BlockWithUUID {
  block.uuid = uuid
}
export const useStore = defineStore('main', () => {
  const snakes: Ref<Record<string, Snake>> = ref({})
  const grabbing = ref(false)
  const addBlock = (block: Block, anchorTail: Vector2) => {
    setUUID(block, uuidv4())
    const snakeUUID = uuidv4()
    snakes.value[snakeUUID] = new Snake({
      uuid: snakeUUID,
      blocks: [block],
      anchorTail,
    })
  }
  const updateSnake = (snake: Snake) => {
    snakes.value[snake.uuid] = snake
  }
  const grabStart = (grabbingBlock: BlockWithUUID) => {
    grabbing.value = true
  }
  const grabEnd = () => {
    grabbing.value = false
  }
  return { snakes, addBlock, updateSnake }
})
