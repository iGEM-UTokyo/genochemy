<template>
  <IconButton @click="open" background-color="#5E35B1" color="white">
    <font-awesome-icon icon="dna" />
  </IconButton>
  <Dialog v-model="showDialog" title="vDNA.title">
    {{ t("vDNA.description") }}
    <div class="vdna-container" ref="containerRef">
      <div v-for="(line, index) of vDNASequences" :key="index">
        <div class="sequence">{{ line.text }}</div>
        <div class="annotations">
          <div
            class="annotation"
            v-for="annotation of line.annotations"
            :key="annotation.label"
            :style="{ left: annotation.left, width: annotation.width }"
          >
            {{ t(annotation.label) }}
          </div>
        </div>
      </div>
    </div>
    <div class="helps">
      <div
        class="help"
        ref="help1Ref"
        @pointerenter="showHelp1 = true"
        @pointerleave="showHelp1 = false"
      >
        {{ t("vDNA.whatThisMeans") }}
      </div>
      <div
        class="help"
        ref="help2Ref"
        @pointerenter="showHelp2 = true"
        @pointerleave="showHelp2 = false"
      >
        {{ t("vDNA.howUsed") }}
      </div>
      <tooltip
        :rect="help1Ref?.getBoundingClientRect() ?? null"
        :show="showHelp1"
      >
        {{ t("vDNA.whatThisMeansDescription") }}
      </tooltip>
      <tooltip
        :rect="help2Ref?.getBoundingClientRect() ?? null"
        :show="showHelp2"
      >
        {{ t("vDNA.howUsedDescription") }}
      </tooltip>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import IconButton from "./IconButton.vue";
import Dialog from "./Dialog.vue";
import { computed, Ref, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { VDNA, toVDNAs } from "@/utils/v-dna";
import Tooltip from "./tooltip/Tooltip.vue";

const { t } = useI18n();
const showDialog = ref(false);
const vDNAs = ref<VDNA[]>([]);
const { snakes, isRunning, beforePlaySnakes } = toRefs(useStore());
const open = () => {
  showDialog.value = true;
  const _snakes = isRunning ? snakes.value : beforePlaySnakes.value;
  vDNAs.value = toVDNAs(Object.values(_snakes));
};
const containerRef: Ref<HTMLElement | null> = ref(null);
const fontWidth = 9.6;
const lineLength = computed(() =>
  Math.floor(
    Math.max((containerRef.value?.clientWidth ?? 0) - 20, 0) / fontWidth
  )
);
type Annotation = { left: string; width: string; label: string };
type Line = { text: string; annotations: Annotation[] };
const vDNASequences = computed(() => {
  let result: Line[] = [];
  const _lineLength = lineLength.value;
  if (_lineLength === 0) return result;
  for (const vDNA of vDNAs.value) {
    const lines: Line[] = [];
    let currentAnnotationIndex = 0;
    for (let i = 0; i < Math.ceil(vDNA.vDNA.length / _lineLength); i++) {
      const text = vDNA.vDNA.substring(i * _lineLength, (i + 1) * _lineLength);
      const annotations: Annotation[] = [];
      currentAnnotationIndex = Math.max(0, currentAnnotationIndex - 1);
      while (
        currentAnnotationIndex < vDNA.annotations.length &&
        vDNA.annotations[currentAnnotationIndex].from < (i + 1) * _lineLength
      ) {
        const currentAnnotation = vDNA.annotations[currentAnnotationIndex];
        if (currentAnnotation.to < i * _lineLength) {
          currentAnnotationIndex++;
          continue;
        }
        const left = Math.max(currentAnnotation.from - i * _lineLength, 0);
        const right = Math.min(
          currentAnnotation.to - i * _lineLength,
          _lineLength
        );
        annotations.push({
          left: `${left * fontWidth}px`,
          width: `${(right - left) * fontWidth}px`,
          label: currentAnnotation.label,
        });
        currentAnnotationIndex++;
      }
      lines.push({ text, annotations });
    }
    result = [...result, ...lines];
  }
  return result;
});

const help1Ref: Ref<HTMLElement | null> = ref(null);
const help2Ref: Ref<HTMLElement | null> = ref(null);

const showHelp1 = ref(false);
const showHelp2 = ref(false);
</script>

<style scoped>
.vdna-container {
  width: 100%;
  flex: 1;
  font-family: "Roboto Mono", monospace;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 10px;
}
.annotations {
  position: relative;
  height: 21.5px;
}
.annotation {
  position: absolute;
  border: 1px solid #aaa;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
  font-family: "Zen Maru Gothic", sans-serif;
}
.helps {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}
.help {
  padding: 10px;
  flex: 1;
  border: 1px solid #aaa;
  text-align: center;
  border-radius: 10px;
}
</style>
