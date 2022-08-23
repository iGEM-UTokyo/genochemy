<template>
  <div class="tray">
    <div class="tray-inner">
      <TrayBlock v-for="block in blocks" :key="block.name" :block="block" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TrayBlock from "./TrayBlock.vue";
import * as block from "@/utils/block";

const blocks = [
  new block.T7PromoterBlock(),
  new block.DrugRepressiblePromoterBlock(),
  new block.EL222ActivatedPromoterBlock(),
  new block.MCherryBlock(),
  new block.GFPBlock(),
  new block.RepressorBlock(),
  new block.EL222Block(),
  new block.CYC1TerminatorBlock(),
  new block.RecombinaseABlock(),
  new block.RecombinaseARecognitionSeqBlock(),
];
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
