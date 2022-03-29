import { defineStore } from 'pinia'
import { Block } from '../utils/block'

export const useStore = defineStore('main', () => {
  const blocks: Block[] = []
  return { blocks }
})
