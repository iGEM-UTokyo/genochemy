<template>
  <div class="tabs-container">
    <tabs :tabs="['Protein', 'RNA']" v-model="activeTab">
      <div class="tab-button" @click="run">
        <font-awesome-icon :icon="store.isRunning ? 'rotate-left' : 'play'" />
      </div>
      <div class="tab-button" @click="stop" v-if="store.isRunning">
        <font-awesome-icon icon="stop" />
      </div>
    </tabs>
    <tab-messenger-r-n-a v-if="activeTab === 'RNA'" />
    <tab-protein v-if="activeTab === 'Protein'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store";
import Tabs from "@/components/Tabs.vue";
import TabMessengerRNA from "@/components/TabMessengerRNA.vue";
import TabProtein from "@/components/TabProtein.vue";

const store = useStore();
const { run, stop } = store;
const activeTab = ref("Protein");
</script>

<style scoped>
.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.tab-button {
  padding: 5px 10px;
}
.tab-content {
  flex: 1;
  padding: 10px 0;
}
</style>
