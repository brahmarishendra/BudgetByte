import { computed, ref } from 'vue';

export function usePieChart(transactions = ref([])) {
  const loadingPie = ref(false);
  const errorPie = ref(null);
  const colors = ['#f8d824', '#ae6bff', '#082f54', '#3569b7', '#80b8ec', '#61a54f'];

  const categoryTotals = computed(() => {
    const totals = {};
    transactions.value
      .filter((transaction) => String(transaction.type).toLowerCase() === 'expense')
      .forEach((transaction) => {
        const category = String(transaction.category || 'Other');
        const amount = Number(transaction.amount) || 0;
        totals[category] = (totals[category] || 0) + amount;
      });

    const sorted = Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((first, second) => second.value - first.value);
    const top = sorted.slice(0, 5);
    const restTotal = sorted.slice(5).reduce((sum, category) => sum + category.value, 0);
    if (restTotal > 0) top.push({ name: 'Other', value: restTotal });
    return top;
  });

  const totalExpenses = computed(() => categoryTotals.value.reduce((sum, category) => sum + category.value, 0));
  const highestExpenseCategory = computed(() => categoryTotals.value[0]?.name || 'None');

  const pieData = computed(() => ({
    labels: categoryTotals.value.map((category) => category.name),
    datasets: [{
      data: categoryTotals.value.map((category) => category.value),
      backgroundColor: categoryTotals.value.map((_, index) => colors[index % colors.length]),
      borderColor: '#ffffff',
      borderWidth: 4,
      borderRadius: 5,
      spacing: 2,
      hoverOffset: 8,
    }],
  }));

  const hasPieData = computed(() => categoryTotals.value.length > 0);
  const pieChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    font: { family: '"Plus Jakarta Sans", sans-serif' },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#465363',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          font: { family: '"Plus Jakarta Sans", sans-serif', size: 10, weight: '600' },
        },
      },
      tooltip: {
        backgroundColor: '#102b45',
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (context) => {
            const value = Number(context.raw || 0);
            const percentage = totalExpenses.value ? ((value / totalExpenses.value) * 100).toFixed(1) : '0.0';
            return `${context.label}: Rs. ${value.toLocaleString('en-IN')} (${percentage}%)`;
          },
          footer: () => `Total expenses: Rs. ${totalExpenses.value.toLocaleString('en-IN')}`,
        },
      },
    },
  }));

  const fetchPieData = () => {
    errorPie.value = null;
  };

  return {
    pieData,
    pieChartOptions,
    hasPieData,
    loadingPie,
    errorPie,
    fetchPieData,
    highestExpenseCategory,
  };
}
