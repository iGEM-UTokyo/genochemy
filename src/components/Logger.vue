<template>
  <Line
    :chart-options="(chartOptions as any)"
    :chart-data="(chartData as any)"
  />
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
  ChartOptions,
} from "chart.js";
import { useStore } from "@/store";
import { ref, defineProps, watch, toRefs, onUnmounted } from "vue";

ChartJS.register(
  Title,
  Tooltip,
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
  target: string;
}>();

const store = useStore();
const { time, currentRunner } = toRefs(store);
const { target } = toRefs(props);

store.registerOutput(target.value);
onUnmounted(() => {
  store.UnregisterOutput(target.value);
});

watch(time, () => {
  chartData.value.datasets[0].data[time.value.toFixed(2)] =
    store.runnerOutputs[target.value];
});

watch(currentRunner, () => {
  chartData.value.datasets[0].data = {};
});

const chartData = ref<{ datasets: { data: Record<string, number> }[] }>({
  datasets: [
    {
      data: {},
    },
  ],
});

const chartOptions = ref<ChartOptions>({
  responsive: true,
  animation: false,
});
</script>
