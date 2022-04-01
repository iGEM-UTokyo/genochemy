<template>
  <div class="program">
    <Block
      v-for="block in blocks"
      :key="block.uuid"
      :block="block" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'
import Block from './Block.vue'

const { blocks } = useStore()

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
