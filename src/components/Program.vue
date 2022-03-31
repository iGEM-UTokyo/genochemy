<template>
  <div class="program">
    <component
      v-for="component in blockComponents"
      :key="component.block.uuid"
      :is="component.is"
      :block="component.block" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'
import Promoter from './blocks/Promoter.vue'
import Visible from './blocks/Promoter.vue'

const componentName = {
  'promoter': Promoter,
  'visible': Visible,
}

const { blocks } = useStore()

const blockComponents = computed(() => {
  return blocks.map(block => {
    return {
      block,
      is: componentName[block.type],
    }
  })
})
</script>

<style scoped>
.tray {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 20px;
  border-right: 1px solid #aaa;
}
</style>
