<template>
  <div class="program">
    <component
      v-for="(component, index) in blockComponents"
      :key="index"
      :is="component.is"
      :block="block" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { programStore } from '~/store'

const componentName = {
  'promoter': 'BlocksPromoter',
  'visible': 'BlocksVisible',
}
export default Vue.extend({
  name: 'Program',
  computed: {
    blockComponents() {
      return programStore.blocks.map(block => {
        return {
          block,
          is: componentName[block.type],
        }
      })
    },
  }
})
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
