<script setup>
// Import the Bar chart wrapper from vue-chartjs.
import { Bar } from 'vue-chartjs';

// Register the Chart.js modules required to render a bar chart.
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';

// Register chart components so Chart.js can render the bar chart correctly.
ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip);

// Accept reactive chart data and configuration from the parent component.
defineProps({
  data: { type: Object, required: true },
  options: { type: Object, required: true },
  plugins: { type: Array, default: () => [] },
});
</script>

<template>
  <!-- Render the monthly spending bar chart with the supplied data/options -->
  <Bar :data="data" :options="options" :plugins="plugins" />
</template>
