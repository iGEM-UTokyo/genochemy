<template>
  <Line :chart-options="chartOptions" :chart-data="chartData" />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Plugin,
} from "chart.js";
import { useStore } from "@/store";
import { ref, defineProps, watch, toRefs, onUnmounted } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

const props = defineProps<{
  chartId?: string;
  datasetIdKey?: string;
  width?: number;
  height?: number;
  cssClasses?: string;
}>();
const store = useStore();
const { time } = toRefs(store);
store.registerOutput("protein-mCherry");
onUnmounted(() => {
  store.UnregisterOutput("protein-mCherry");
});

watch(time, () => {
  chartData.value.datasets[0].data[time.value] =
    store.runnerOutputs["protein-mCherry"];
});

const chartData = ref({
  datasets: [
    {
      data: {},
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  animation: false,
});
</script>
