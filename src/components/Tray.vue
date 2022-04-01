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
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 20px;
  border-right: 1px solid #aaa;
}
</style>
