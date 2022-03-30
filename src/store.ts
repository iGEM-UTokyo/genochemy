import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Block } from './utils/block'

export const useStore = defineStore('main', () => {
  const blocks: Ref<Block[]> = ref([])
  const addBlock = (block: Block) => {
    blocks.value.push(block)
  }
  return { blocks, addBlock }
})
