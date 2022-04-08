<template>
  <div class="tray">
    <TrayBlock
      v-for="(detail, name) in blockDesignDetails"
      :key="name"
      :blockName="name"
      :src="detail.imageSrc"
      :block-class="detail.blockClass"
    />
  </div>
</template>

<script setup lang="ts">
import TrayBlock from './TrayBlock.vue'
import { blockDesignDetails } from '../utils/block-designs'
</script>

<style scoped>
.tray {
  width: 220px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  box-sizing: border-box;
  border-right: 1px solid #aaa;
}
</style>
