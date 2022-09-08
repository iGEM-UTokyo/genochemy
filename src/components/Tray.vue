<template>
  <div class="tray">
    <div class="tray-inner">
      <TrayBlock
        v-for="(blockClass, index) in allFinalBlockClasses"
        :key="index"
        :block-class="blockClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TrayBlock from "./TrayBlock.vue";
import { allFinalBlockClasses } from "@/utils/block";
</script>

<style scoped>
.tray {
  height: 200px;
  position: relative;
  border-top: 1px solid #aaa;
}
.tray-inner {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px;
  padding: 10px;
  box-sizing: border-box;
}
</style>
