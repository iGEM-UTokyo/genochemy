<template>
  <div class="tabs">
    <div class="tab-item">Block</div>
    <div class="tab-item">RNA</div>
    <div class="tab-item">Protein</div>
    <div class="tabs-separator" />
    <div class="tab-button" @click="run"><font-awesome-icon icon="play" /></div>
    <div class="tab-button" @click="stop">
      <font-awesome-icon icon="stop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
const { run, stop } = useStore();
</script>

<style scoped>
.tabs {
  margin-top: 5px;
  display: flex;
  align-items: center;
}
.tab-item {
  padding: 5px 10px;
  border: 1px solid #aaa;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: none;
}
.tabs-separator {
  flex: 1;
}
.tab-button {
  padding: 5px 10px;
}
</style>
