<template>
  <div class="tray">
    <Promoter />
    <Visible />
  </div>
</template>

<script setup lang="ts">
import Promoter from './blocks/Promoter.vue'
import Visible from './blocks/Visible.vue'
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
