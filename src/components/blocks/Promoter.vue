<template>
  <div @click="click">
    <img src="@/assets/blocks/promoter.svg" />
    <span>T7 promoter</span>
  </div>
</template>

<style scoped>
div {
  position: relative;
}
img {
  width: 100%;
}
span {
  color: white;
  position: absolute;
  left: 20px;
  bottom: 15px;
  font-size: 18px;
}
</style>

<script setup lang="ts">
import { PromoterBlock } from '../../utils/block'
import { useStore } from '../../store'

const { addBlock } = useStore()
const click = () => {
  console.log("hoge")
  addBlock(new PromoterBlock('T7 promoter', [0, 0]))
}
</script>

