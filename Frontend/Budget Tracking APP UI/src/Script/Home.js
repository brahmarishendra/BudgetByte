import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDespia } from '@/composables/useDespia';
import { apiUrl } from '@/config/api';
import { useAiChatbot } from '@/Script/AiChatbot.js';

export function Home() {
  const router = useRouter();
  // Despia native bridge
  const { despia, isDespia } = useDespia();

  const showBalance = ref(true);
  const activeTab = ref('Home'); // 'Home' | 'Dashboard' | 'AI' | 'Profile'
  const transactions = ref([]);
  const isLoadingTransactions = ref(false);
  const showTransactionModal = ref(false);
  const showProfileModal = ref(false);
  const showTransactions = ref(false);
  const editingTransaction = ref(false);
  const searchQuery = ref('');
  const selectedYear = ref('all');
  const selectedMonth = ref('all');
  const selectedDate = ref('');
  const defaultAvatarUrl = '';
  const uploadImage = ref(localStorage.getItem('profileImage') || defaultAvatarUrl);
  const fileInputRef = ref(null);
  // Filter by transaction type: 'all', 'income', 'expense'
  const selectedValue = ref('all');

  // Dynamically resolve profile from logged in user data in localStorage
  const getInitialProfile = () => {
    try {
      const saved = localStorage.getItem('profile');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('userName') || (email ? email.split('@')[0] : 'User');
    return { name: name || 'Account', email: email || 'user@budgetbyte.com' };
  };

  const profile = ref(getInitialProfile());
  const profileDraft = ref({ ...profile.value });
  const isSubmitting = ref(false);
  const formMessage = ref('');
  const formError = ref('');
  const formData = ref({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    comments: '',
    date: new Date().toISOString().slice(0, 10),
  });

  // Overall Balance
  const balance = computed(() => transactions.value.reduce((total, transaction) => {
    const amount = Number(transaction.amount) || 0;
    return total + (transaction.type === 'income' ? amount : -amount);
  }, 0));

  const formattedBalance = computed(() => balance.value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }));

  const availableYears = computed(() => [...new Set(transactions.value
    .map((transaction) => String(transaction.date || '').slice(0, 4))
    .filter(Boolean))].sort((first, second) => second.localeCompare(first)));

  // Filtered Transactions
  const filteredTransactions = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return transactions.value.filter((transaction) => {
      const date = String(transaction.date || '');
      const searchableText = `${transaction.category} ${transaction.description} ${transaction.comments || ''} ${transaction.type}`.toLowerCase();
      return (!query || searchableText.includes(query))
        && (selectedYear.value === 'all' || date.startsWith(selectedYear.value))
        && (selectedMonth.value === 'all' || date.slice(5, 7) === selectedMonth.value)
        && (!selectedDate.value || date === selectedDate.value)
        && (selectedValue.value === 'all' || transaction.type === selectedValue.value);
    });
  });

  // Monthly / Filter-wise Totals
  const filteredIncome = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  });

  const filteredExpense = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  });

  const filteredNet = computed(() => filteredIncome.value - filteredExpense.value);

  const filteredCount = computed(() => filteredTransactions.value.length);

  // Six-month spending trend ending in the current month.
  const monthlyChartData = computed(() => {
    const now = new Date();
    const chartYear = selectedYear.value === 'all' ? now.getFullYear() : Number(selectedYear.value);

    return Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(chartYear, now.getMonth() - 5 + index, 1);
      const monthCode = String(monthDate.getMonth() + 1).padStart(2, '0');
      const monthKey = `${monthDate.getFullYear()}-${monthCode}`;
      const monthTxns = transactions.value.filter(t => {
        const d = String(t.date || '');
        return d.startsWith(monthKey);
      });
      const expense = monthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const income = monthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      return {
        month: monthDate.toLocaleString('en', { month: 'short' }),
        expense,
        income,
        count: monthTxns.length
      };
    });

  });


  // Open the native file picker for a local profile photo.
  const triggerFileSelect = () => {
    fileInputRef.value?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      event.target.value = '';
      return;
    }

    try {
      const imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read the selected image.'));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error('Could not decode the selected image.'));
          image.onload = () => {
            const maxDimension = 512;
            const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

            const context = canvas.getContext('2d');
            if (!context) {
              reject(new Error('Could not prepare the selected image.'));
              return;
            }

            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          };
          image.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      });

      uploadImage.value = imageData;
      try {
        localStorage.setItem('profileImage', imageData);
      } catch (storageError) {
        console.warn('Profile photo preview is temporary because local storage is full.', storageError);
      }
    } catch (error) {
      console.error('Could not load profile photo:', error);
    } finally {
      event.target.value = '';
    }
  };

  // Draw a dotted guide and readable value label above each bar.
  const dottedLinePlugin = {
    id: 'dottedLinePlugin',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea, data } = chart;
      const bars = chart.getDatasetMeta(0).data;
      if (!chartArea || !bars.length) return;

      ctx.save();
      ctx.strokeStyle = '#c0c0c0';
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 1;
      ctx.fillStyle = '#717780';
      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      bars.forEach((bar, index) => {
        const amount = Number(data.datasets[0].data[index]) || 0;
        const label = amount.toLocaleString('en-IN').replace(/,/g, ' ');

        ctx.fillText(label, bar.x, bar.y - 6);
        ctx.beginPath();
        ctx.moveTo(bar.x, chartArea.top + 15);
        ctx.lineTo(bar.x, bar.y);
        ctx.stroke();
      });

      ctx.restore();
    },
  };

// 2. Computed object containing JUST the Chart Data configuration
const monthlyBarData = computed(() => ({
  labels: monthlyChartData.value.map((month) => month.month),
  datasets: [
    {
      data: monthlyChartData.value.map((month) => month.expense),
      // Muted red/orange for past months, vibrant olive green for the latest active month
      backgroundColor: monthlyChartData.value.map((_, index) => 
        index === monthlyChartData.value.length - 1 ? '#80b103' : '#c2330f'
      ),
      borderRadius: 0,
      maxBarThickness: 24,
      categoryPercentage: 0.64,
      barPercentage: 0.28,
    },
  ]
}));

// 3. Chart options for axes and hover tooltips.
const monthlyBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  font: { family: '"Plus Jakarta Sans", sans-serif' },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#717780', font: { family: '"Plus Jakarta Sans", sans-serif', size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { display: false },
      border: { display: false },
      ticks: { display: false },
      grace: '20%' // Adds padding at the top so floating numbers don't get clipped off the canvas
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#102b45',
      padding: 10,
      cornerRadius: 10,
      callbacks: {
        label: (context) => `Spent: Rs. ${Number(context.raw || 0).toLocaleString('en-IN')}`,
      },
    },
  }
};

// Pass custom drawing behavior to the bar chart component.
const chartPlugins = [dottedLinePlugin];

// Total expenses computation
const sixMonthExpense = computed(() => monthlyChartData.value
  .reduce((total, month) => total + month.expense, 0));


  // Average Expenses

  const TotalExpenses = () => {
    return filteredTransactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  };

  const TotalIncomes = () => {
    return filteredTransactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  };

  const income = () => {
    selectedValue.value = 'income';
  };

  const expense = () => {
    selectedValue.value = 'expense';
  };

  // AI Chatbot Assistant from separate JS file
  const {
    isAiThinking,
    chatInput,
    chatMessages,
    sendChatMessage,
  } = useAiChatbot({
    transactions,
    filteredIncome,
    filteredExpense,
    filteredNet,
    filteredCount,
    formattedBalance,
  });

  const clearSession = () => {
    sessionStorage.clear();
    localStorage.clear();
  };

  const userHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    'X-User-Id': localStorage.getItem('userId') || '',
  });

  // Session check
  const message = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      clearSession();
      await router.push('/login');
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/message'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        clearSession();
        await router.push('/login');
      }
    } catch (error) {
      console.warn('Session verification fallback:', error);
    }
  };

  const loadTransactions = async () => {
    isLoadingTransactions.value = true;
    try {
      const response = await fetch(apiUrl('/api/transcation'), {
        headers: userHeaders(),
      });
      if (!response.ok) throw new Error('Could not load transactions.');
      transactions.value = await response.json();
    } catch (error) {
      if (!transactions.value.length) formError.value = error.message;
    } finally {
      isLoadingTransactions.value = false;
    }
  };

  const openTransactionModal = (type = 'expense') => {
    formMessage.value = '';
    formError.value = '';
    formData.value = {
      type,
      amount: '',
      category: '',
      description: '',
      comments: '',
      date: new Date().toISOString().slice(0, 10),
    };
    //editingTransaction.value = false;
    showTransactionModal.value = true;
  };

  // Open the transaction modal for editing an existing transaction

  const openEditTransactionModal = (transaction) => {
    formMessage.value = '';
    formError.value = '';
    formData.value = { ...transaction };
    editingTransaction.value = true;
    showTransactionModal.value = true;
  };

  const closeTransactionModal = () => {
    if (!isSubmitting.value) {
      showTransactionModal.value = false;
      editingTransaction.value = false;
    }
  };

  const form = async () => {
    formMessage.value = '';
    formError.value = '';

    if (!formData.value.amount || !formData.value.category || !formData.value.description) {
      formError.value = 'Amount, category, and description are required.';
      return;
    }

    isSubmitting.value = true;

    try {
      const endpoint = editingTransaction.value ? '/api/transcation/update' : '/api/transcation/add';
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...userHeaders(),
        },
        body: JSON.stringify(formData.value),
      });

      if (response.status === 401) {
        clearSession();
        await router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to save transaction.');

      formMessage.value = editingTransaction.value ? 'Transaction updated.' : 'Transaction added.';
      showTransactionModal.value = false;
      editingTransaction.value = false;
      await loadTransactions();
    } catch (error) {
      if (editingTransaction.value) {
        const index = transactions.value.findIndex((transaction) => transaction.id === formData.value.id);
        if (index !== -1) transactions.value[index] = { ...formData.value };
        formMessage.value = 'Updated on this device.';
      } else {
        const localTransaction = { id: `local-${Date.now()}`, ...formData.value };
        transactions.value.unshift(localTransaction);
        formMessage.value = 'Saved on this device.';
      }
      showTransactionModal.value = false;
      editingTransaction.value = false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const deleteTransaction = async (transaction) => {
    if (!window.confirm(`Delete ${transaction.category} (Rs. ${transaction.amount})?`)) return;

    if (String(transaction.id).startsWith('local-')) {
      transactions.value = transactions.value.filter((item) => item.id !== transaction.id);
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/transcation/delete'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...userHeaders(),
        },
        body: JSON.stringify({ id: transaction.id }),
      });
      if (!response.ok) throw new Error('Transaction could not be deleted.');
      transactions.value = transactions.value.filter((item) => item.id !== transaction.id);
    } catch (error) {
      formError.value = error.message;
    }
  };

  const clear_date = () => {
    selectedDate.value = '';

  }

  // Profile Management
  const openProfileModal = () => {
    profileDraft.value = { ...profile.value };
    showProfileModal.value = true;
  };

  const saveProfile = () => {
    if (!profileDraft.value.name.trim()) return;
    profile.value = { ...profileDraft.value };
    localStorage.setItem('profile', JSON.stringify(profile.value));
    localStorage.setItem('userName', profile.value.name);
    localStorage.setItem('userEmail', profile.value.email);
    showProfileModal.value = false;
  };

  // Excel (.xlsx compatible CSV with UTF-8 BOM) export
  const exportToExcel = () => {
    if (!filteredTransactions.value.length) {
      alert('No transactions found to export for the selected filter.');
      return;
    }

    const monthName = selectedMonth.value !== 'all' ? `Month-${selectedMonth.value}` : 'All-Months';
    const yearName = selectedYear.value !== 'all' ? selectedYear.value : 'All-Years';
    const filename = `Budget_Report_${yearName}_${monthName}_${new Date().toISOString().slice(0, 10)}.csv`;

    let csv = '\uFEFF'; // Excel UTF-8 BOM
    csv += 'Transaction ID,Date,Type,Category,Description,Amount (Rs.)\r\n';

    filteredTransactions.value.forEach((t) => {
      const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      csv += `${escape(t.id)},${escape(t.date)},${escape(t.type)},${escape(t.category)},${escape(t.description)},${Number(t.amount) || 0}\r\n`;
    });

    csv += '\r\n';
    csv += `Summary,Period: ${yearName} - ${monthName}\r\n`;
    csv += `Total Filtered Income (Rs.),${filteredIncome.value}\r\n`;
    csv += `Total Filtered Expenses (Rs.),${filteredExpense.value}\r\n`;
    csv += `Net Monthly Cashflow (Rs.),${filteredNet.value}\r\n`;
    csv += `Total Transactions Count,${filteredCount.value}\r\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatAmount = (amount) => Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  onMounted(async () => {
    if (isDespia) console.info('Despia native bridge ready', despia);

    // Resolve logged in profile
    const saved = localStorage.getItem('profile');
    if (saved) {
      try {
        profile.value = JSON.parse(saved);
      } catch (e) { }
    } else {
      const email = localStorage.getItem('userEmail') || '';
      const name = localStorage.getItem('userName') || (email ? email.split('@')[0] : 'User');
      profile.value = { name: name || 'Account', email: email || 'user@budgetbyte.com' };
    }

    await message();
    await loadTransactions();
  });

  const logout = () => {
    clearSession();
    router.push('/login');
  };

  return {
    despia,
    isDespia,
    showBalance,
    activeTab,
    transactions,
    isLoadingTransactions,
    showTransactionModal,
    showProfileModal,
    showTransactions,
    editingTransaction,
    searchQuery,
    selectedYear,
    selectedMonth,
    selectedDate,
    selectedValue,
    profile,
    profileDraft,
    isSubmitting,
    formMessage,
    formError,
    formData,
    formattedBalance,
    availableYears,
    filteredTransactions,
    filteredIncome,
    filteredExpense,
    filteredNet,
    filteredCount,
    monthlyChartData,
    monthlyBarData,
    monthlyBarOptions,
    chartPlugins,
    sixMonthExpense,
    TotalExpenses,
    TotalIncomes,
    clear_date,
    income,
    expense,
    exportToExcel,
    uploadImage,
    fileInputRef,
    triggerFileSelect,
    handleFileChange,
    chatMessages,
    chatInput,
    isAiThinking,
    sendChatMessage,
    openTransactionModal,
    openEditTransactionModal,
    closeTransactionModal,
    form,
    deleteTransaction,
    openProfileModal,
    saveProfile,
    formatAmount,
    logout,
  };
};