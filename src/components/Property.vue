<template>
  <div class="tabs-container">
    <tabs :tabs="['Protein', 'RNA', 'Questions', 'Load']" v-model="activeTab">
      <div class="tab-button" @click="run">
        <font-awesome-icon :icon="store.isRunning ? 'rotate-left' : 'play'" />
      </div>
      <div class="tab-button" @click="stop" v-if="store.isRunning">
        <font-awesome-icon icon="stop" />
      </div>
    </tabs>
    <div class="tab">
      <tab-messenger-r-n-a v-if="activeTab === 'RNA'" />
      <tab-protein v-if="activeTab === 'Protein'" />
      <tab-questions v-if="activeTab === 'Questions'" />
      <tab-load v-if="activeTab === 'Load'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store";
import Tabs from "@/components/Tabs.vue";
import TabMessengerRNA from "@/components/TabMessengerRNA.vue";
import TabProtein from "@/components/TabProtein.vue";
import TabQuestions from "@/components/TabQuestions.vue";
import TabLoad from "@/components/TabLoad.vue";

const store = useStore();
const { run, stop } = store;
const activeTab = ref("Protein");
</script>

<style scoped>
.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tab-button {
  padding: 5px 10px;
}

.tab {
  flex: 1;
  display: flex;
  border-left: 1px solid #aaa;
  padding: 0 10px;
  align-items: stretch;
  overflow: hidden;
}
.tab-content {
  flex: 1;
  padding: 10px 0;
  overflow-y: auto;
}
</style>
