<template>
  <div class="tray">
    <div class="tray-inner">
      <TrayBlock
        v-for="(detail, name) in blockDesignDetails"
        :key="name"
        :blockName="name"
        :detail="detail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TrayBlock from "./TrayBlock.vue";
import { blockDesignDetails } from "../utils/block-designs";
</script>

<style scoped>
.tray {
  width: 220px;
  height: 100%;
  position: relative;
}
.tray-inner {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  box-sizing: border-box;
  border-right: 1px solid #aaa;
}
</style>
