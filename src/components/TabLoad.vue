<template>
  <div class="tab-content">
    <button @click="load">Import UTokyo 2022 Project</button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import * as blocks from "@/utils/block";
import { Snake } from "@/utils/snake";
import { v4 as uuidv4 } from "uuid";

const { addSnake } = useStore();

function bulkSetUUID(
  blocks: blocks.Block[]
): asserts blocks is blocks.BlockWithUUID[] {
  for (const block of blocks) {
    block.uuid = uuidv4();
  }
}
function load() {
  const blocks1 = [
    new blocks.T7PromoterBlock(),
    new blocks.EL222Block(),
    new blocks.PhyBBlock(),
    new blocks.PIF3Block(),
    new blocks.CYC1TerminatorBlock(),
  ];
  bulkSetUUID(blocks1);
  const snake1 = new Snake({
    uuid: uuidv4(),
    blocks: blocks1,
    anchorTail: [10, 100],
  });
  addSnake(snake1);
  const blocks2 = [
    new blocks.EL222ActivatedPromoterBlock(),
    new blocks.RecombinaseBRecognitionSeqBlock(),
    new blocks.RecombinaseABlock(),
    new blocks.CYC1TerminatorBlock(),
    new blocks.RecombinaseBRecognitionSeqBlock(),
    new blocks.GFPBlock(),
    new blocks.CYC1TerminatorBlock(),
  ];
  bulkSetUUID(blocks2);
  const snake2 = new Snake({
    uuid: uuidv4(),
    blocks: blocks2,
    anchorTail: [10, 200],
  });
  addSnake(snake2);
  const blocks3 = [
    new blocks.PhyBPIF3ActivatedPromoterBlock(),
    new blocks.RecombinaseARecognitionSeqBlock(),
    new blocks.KillSwitchBlock(),
    new blocks.CYC1TerminatorBlock(),
    new blocks.RecombinaseARecognitionSeqBlock(),
    new blocks.RecombinaseBBlock(),
    new blocks.CYC1TerminatorBlock(),
  ];
  bulkSetUUID(blocks3);
  const snake3 = new Snake({
    uuid: uuidv4(),
    blocks: blocks3,
    anchorTail: [10, 300],
  });
  addSnake(snake3);
}
</script>

<style scoped>
button {
  background-color: white;
  border: 1px solid #aaa;
  padding: 10px;
  border-radius: 10px;
}
</style>
