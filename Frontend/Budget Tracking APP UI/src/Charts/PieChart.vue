<script setup>
import { Pie } from 'vue-chartjs';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(ArcElement, Legend, Tooltip);

defineProps({
  data: { type: Object, required: true },
  options: { type: Object, required: true },
});
</script>

<template>
  <Pie :data="data" :options="options" />
</template>
