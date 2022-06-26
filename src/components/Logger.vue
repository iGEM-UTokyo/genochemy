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
import { ref, defineProps } from "vue";

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
let i = 1;
setInterval(() => {
  chartData.value.datasets[0].data[i] = Math.random() * 50;
  i += 1;
}, 50);

const chartData = ref({
  datasets: [
    {
      data: {
        [0]: 1,
        [1]: 10,
      },
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  animation: false,
});
</script>
