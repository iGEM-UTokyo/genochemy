import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Block, BlockWithUUID } from './utils/block'
import { v4 as uuidv4 } from 'uuid'

function setUUID(block: Block, uuid: string): asserts block is BlockWithUUID {
  block.uuid = uuid
}
export const useStore = defineStore('main', () => {
  const blocks: Ref<BlockWithUUID[]> = ref([])
  const addBlock = (block: Block) => {
    setUUID(block, uuidv4())
    blocks.value.push(block)
  }
  const updateBlock = (block: BlockWithUUID) => {
    // todo: to obj
    for (let i = 0; i < blocks.value.length; i++) {
      if (blocks.value[i].uuid === block.uuid) {
        blocks.value[i] = block
        break
      }
    }
  }
  return { blocks, addBlock, updateBlock }
})
