<template>
  <div class="program">
    <Snake
      v-for="snake in snakes"
      :key="snake.uuid"
      :snake="snake" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store'
import Snake from '@/components/Snake.vue'

const { snakes } = useStore()

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
