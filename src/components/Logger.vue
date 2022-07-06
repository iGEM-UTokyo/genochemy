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
  target?: string;
}>();

const store = useStore();
const { time } = toRefs(store);
const { target } = toRefs(props);

console.log("TARGET:" + target.value);

store.registerOutput(target.value);
onUnmounted(() => {
  store.UnregisterOutput(target.value);
});

watch(time, () => {
  chartData.value.datasets[0].data[time.value] =
    store.runnerOutputs[target.value];
  console.log(store.runnerOutputs[target.value]);
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
