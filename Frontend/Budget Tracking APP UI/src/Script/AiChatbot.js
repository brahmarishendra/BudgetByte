import { ref } from 'vue';

export function useAiChatbot(context = {}) {
  const isAiThinking = ref(false);
  const chatInput = ref('');
  const chatMessages = ref([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Hi! I am your BudgetByte AI Financial Advisor. Ask me anything about your spending, math aggregations (averages, burn rate, savings percentage), or ask for smart budget tips!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Math Aggregation Functions
  const getAggregations = (transactions, income, expense) => {
    const expenseList = transactions.filter(t => t.type === 'expense');
    const incomeList = transactions.filter(t => t.type === 'income');

    const totalExpense = expense || expenseList.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalIncome = income || incomeList.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const netSavings = totalIncome - totalExpense;

    // Average transaction amounts
    const avgExpense = expenseList.length ? (totalExpense / expenseList.length) : 0;
    const avgIncome = incomeList.length ? (totalIncome / incomeList.length) : 0;

    // Max and Min transaction
    const maxExpense = expenseList.length ? Math.max(...expenseList.map(t => Number(t.amount) || 0)) : 0;
    const minExpense = expenseList.length ? Math.min(...expenseList.map(t => Number(t.amount) || 0)) : 0;

    // Category breakdown
    const categoryTotals = {};
    expenseList.forEach(t => {
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(t.amount) || 0);
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        percentage: totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Savings Rate Percentage
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

    // Run-rate projection: assumes 30 days in month
    const todayDate = new Date().getDate();
    const dailyBurnRate = todayDate > 0 ? (totalExpense / todayDate) : totalExpense;
    const projectedMonthEndSpend = dailyBurnRate * 30;

    return {
      totalExpense,
      totalIncome,
      netSavings,
      avgExpense,
      avgIncome,
      maxExpense,
      minExpense,
      categoryBreakdown,
      savingsRate,
      dailyBurnRate,
      projectedMonthEndSpend,
      expenseCount: expenseList.length,
      incomeCount: incomeList.length
    };
  };

  const formatCurrency = (val) => {
    return 'Rs. ' + Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const sendChatMessage = (customText = null) => {
    const text = (customText || chatInput.value).trim();
    if (!text) return;

    chatMessages.value.push({
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    chatInput.value = '';
    isAiThinking.value = true;

    const filteredExpense = context.filteredExpense?.value ?? 0;
    const filteredIncome = context.filteredIncome?.value ?? 0;
    const transactions = context.transactions?.value ?? [];
    const formattedBalance = context.formattedBalance?.value ?? '0.00';

    setTimeout(() => {
      const lower = text.toLowerCase();
      const stats = getAggregations(transactions, filteredIncome, filteredExpense);
      let botResponse = '';

      // 1. Math Aggregation: Average Expense / Income
      if (lower.includes('average') || lower.includes('mean') || lower.includes('avg')) {
        if (lower.includes('income')) {
          botResponse = `📊 Math Aggregation (Average Income):
Your average income per deposit is ${formatCurrency(stats.avgIncome)} across ${stats.incomeCount} records.`;
        } else {
          botResponse = `📊 Math Aggregation (Average Expense):
• Average spend per transaction: ${formatCurrency(stats.avgExpense)}
• Daily burn rate (current month): ${formatCurrency(stats.dailyBurnRate)} / day
• Max single expense: ${formatCurrency(stats.maxExpense)}
• Min single expense: ${formatCurrency(stats.minExpense)}`;
        }
      }
      // 2. Math Aggregation: Savings Rate & Burn Rate / Projection
      else if (lower.includes('savings rate') || lower.includes('rate') || lower.includes('percent')) {
        botResponse = `📈 Financial Reasoning & Savings Analysis:
• Total Income: ${formatCurrency(stats.totalIncome)}
• Total Expenses: ${formatCurrency(stats.totalExpense)}
• Net Retained Savings: ${formatCurrency(stats.netSavings)}
• Savings Rate: ${stats.savingsRate}%

${Number(stats.savingsRate) >= 20 
  ? '🎯 Excellent! A savings rate above 20% meets the golden standard for building long-term wealth.' 
  : '⚠️ Note: Your current savings rate is below the recommended 20% benchmark. Trimming discretionary expenses will accelerate your goals.'}`;
      }
      // 3. Projection & Run-rate
      else if (lower.includes('project') || lower.includes('forecast') || lower.includes('future') || lower.includes('month end')) {
        botResponse = `🔮 Predictive Expense Projection (Run-rate math):
• Current pace: ${formatCurrency(stats.dailyBurnRate)} per day
• Estimated 30-day total: ${formatCurrency(stats.projectedMonthEndSpend)}
${stats.totalIncome > 0 && stats.projectedMonthEndSpend > stats.totalIncome 
  ? '🚨 Alert: At your current daily pace, projected monthly spend exceeds current income. Consider cutting back this week.' 
  : '✅ Stable: Your run-rate is well within your incoming cash flow.'}`;
      }
      // 4. Breakdown / Category Aggregation
      else if (lower.includes('breakdown') || lower.includes('category') || lower.includes('highest') || lower.includes('where my money')) {
        if (stats.categoryBreakdown.length) {
          const top = stats.categoryBreakdown.slice(0, 3).map(c => `• ${c.category}: ${formatCurrency(c.amount)} (${c.percentage}%)`).join('\n');
          botResponse = `🏷️ Category Math Breakdown:
${top}

💡 Reasoning: Your highest spending category is "${stats.categoryBreakdown[0].category}" accounting for ${stats.categoryBreakdown[0].percentage}% of total outflows.`;
        } else {
          botResponse = 'You currently have no expenses categorized for this period.';
        }
      }
      // 5. Intelligent Financial Tips
      else if (lower.includes('tip') || lower.includes('advice') || lower.includes('how to save') || lower.includes('recommend')) {
        const topCat = stats.categoryBreakdown[0]?.category || 'discretionary purchases';
        botResponse = `💡 Smart AI Financial Tips for You:
1. 50/30/20 Rule: Allocate 50% for Needs, 30% for Wants, and 20% directly to your Savings vault on payday.
2. Target "${topCat}": Since "${topCat}" is your top outflow, reducing it by just 10% will save you approximately ${formatCurrency(stats.categoryBreakdown[0]?.amount * 0.1 || 500)} this month!
3. Emergency Cushion: Aim for 3 to 6 months of mandatory expenses (${formatCurrency(stats.totalExpense * 3)} target).`;
      }
      // 6. Direct Balance / Net check
      else if (lower.includes('balance') || lower.includes('net') || lower.includes('total') || lower.includes('spend')) {
        botResponse = `💰 Current Financial Status:
• Total Inflow: ${formatCurrency(stats.totalIncome)}
• Total Outflow: ${formatCurrency(stats.totalExpense)}
• Net Savings: ${formatCurrency(stats.netSavings)}
• Active Balance: Rs. ${formattedBalance}`;
      }
      // 7. General fallback
      else {
        botResponse = `I'm analyzing your ${transactions.length} transactions! 
You can ask me:
• "What is my average daily expense?"
• "What is my savings rate percentage?"
• "Project my month end expenses"
• "Give me tips to save on my highest category"`;
      }

      chatMessages.value.push({
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      isAiThinking.value = false;
    }, 450);
  };

  return {
    isAiThinking,
    chatInput,
    chatMessages,
    sendChatMessage,
  };
}
