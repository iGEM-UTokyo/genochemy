<template>
  <div class="tray">
    <div class="tray-inner">
      <TrayBlock
        v-for="(blockClass, index) in blockClasses"
        :key="index"
        :block-class="blockClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TrayBlock from "./TrayBlock.vue";
import * as block from "@/utils/block";

const blockClasses = [
  block.T7PromoterBlock,
  block.DrugRepressiblePromoterBlock,
  block.EL222ActivatedPromoterBlock,
  block.PhyBPIF3ActivatedPromoterBlock,
  block.MCherryBlock,
  block.GFPBlock,
  block.RepressorBlock,
  block.EL222Block,
  block.PhyBBlock,
  block.PIF3Block,
  block.CYC1TerminatorBlock,
  block.RecombinaseABlock,
  block.RecombinaseARecognitionSeqBlock,
  block.RecombinaseBBlock,
  block.RecombinaseBRecognitionSeqBlock,
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
