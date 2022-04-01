<template>
  <div>
    <img :src="src" />
    <span>{{ props.block.name }}</span>
  </div>
</template>

<style scoped>
div {
  position: relative;
  display: flex /* for height-adjustment */
}
img {
  pointer-events: none;
}
span {
  color: white;
  position: absolute;
  left: 20px;
  bottom: 3px;
  font-size: 16px;
}
</style>

<script setup lang="ts">
import { Block } from '../utils/block'
import { defineProps, computed } from 'vue';
import { blockDesignDetails } from '@/utils/block-designs';

const props = defineProps<{
  block: Block,
}>()
const src = computed(() => blockDesignDetails[props.block.name].imageSrc)
</script>

