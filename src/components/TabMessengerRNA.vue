<template>
  <div class="tab-content">
    <list-box
      :list="mRNANames"
      v-model="activeMessengerRNAName"
      class="mRNA-list"
    />
    <div class="mRNA-settings" v-if="activeMessengerRNA">
      <h3>{{ activeMessengerRNAName }}</h3>
      Promoter(s):
      <list-box :list="promoterNames" v-model="activePromoterName" />
      <section v-if="activePromoter">
        <h4>{{ activePromoterName }}</h4>
        {{ activePromoter.description }}
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import ListBox from "@/components/ListBox.vue";

const store = useStore();
const mRNANames = computed(() =>
  store.operonMessengerRNAs.map((mRNA) => mRNA.name)
);
const activeMessengerRNAName = ref("");
const activeMessengerRNA = computed(() => {
  if (activeMessengerRNAName.value === "") return null;
  const mRNA = store.operonMessengerRNAs.filter(
    (mRNA) => mRNA.name === activeMessengerRNAName.value
  );
  if (mRNA.length !== 1) {
    // throw new Error(`Protein: ${activeProteinName.value} does not exist or duplicates.`)
    return null;
  }
  return mRNA[0];
});
const promoterNames = computed(() => {
  if (!activeMessengerRNA.value) return [];
  return activeMessengerRNA.value.promoters.map((promoter) => promoter.name);
});
const activePromoterName = ref("");
const activePromoter = computed(() => {
  if (!activeMessengerRNA.value) return null;
  const promoter = activeMessengerRNA.value.promoters.filter(
    (promoter) => promoter.name == activePromoterName.value
  );
  if (promoter.length !== 1) return null;
  return promoter[0];
});
// const activeProteinMessengerRNAs = computed(() => {
//   if (activeProtein.value === null) return [];
//   return activeProtein.value.messengerRNAs.map(mRNA => mRNA.name);
// })
</script>

<style scoped>
.mRNA-list {
  width: 150px;
}
.tab-content {
  display: flex;
  align-items: stretch;
}
.mRNA-settings {
  flex: 1;
  margin-left: 10px;
}
h3 {
  margin: 0;
}
</style>
