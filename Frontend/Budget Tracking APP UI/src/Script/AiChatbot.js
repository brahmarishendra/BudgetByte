import { ref } from 'vue';

export function useAiChatbot(context = {}) {
  const isAiThinking = ref(false);
  const chatInput = ref('');
  const chatMessages = ref([]);

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
    const filteredNet = context.filteredNet?.value ?? 0;
    const filteredCount = context.filteredCount?.value ?? 0;
    const formattedBalance = context.formattedBalance?.value ?? '0.00';
    const transactions = context.transactions?.value ?? [];

    setTimeout(() => {
      let botResponse = '';
      const lower = text.toLowerCase();

      if (lower.includes('spend') || lower.includes('expense') || lower.includes('monthly total')) {
        botResponse = `For your active filter, you have spent Rs. ${filteredExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })} across ${filteredCount} transactions.`;
      } else if (lower.includes('income') || lower.includes('earn') || lower.includes('received')) {
        botResponse = `Your total filtered income is Rs. ${filteredIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`;
      } else if (lower.includes('balance') || lower.includes('net') || lower.includes('save') || lower.includes('saving')) {
        if (filteredNet >= 0) {
          botResponse = `Great financial health! Your net positive savings for this period is +Rs. ${filteredNet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`;
        } else {
          botResponse = `Warning: Your expenses exceed income by Rs. ${Math.abs(filteredNet).toLocaleString('en-IN', { minimumFractionDigits: 2 })}. Recommended: Review non-essential expenses.`;
        }
      } else if (lower.includes('category') || lower.includes('highest')) {
        const categoryMap = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + (Number(t.amount) || 0);
        });
        const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
        if (sorted.length) {
          botResponse = `Your top expense category is "${sorted[0][0]}" with Rs. ${sorted[0][1].toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`;
        } else {
          botResponse = `No expense categories recorded yet for this filter.`;
        }
      } else if (lower.includes('tip') || lower.includes('advice')) {
        botResponse = `💡 Smart Tip: Follow the 50/30/20 rule: 50% for Needs, 30% for Wants, and 20% for Savings & Investments!`;
      } else {
        botResponse = `You have ${transactions.length} total transactions logged with an active total balance of Rs. ${formattedBalance}. Feel free to ask about any specific category, expense, or savings advice!`;
      }

      chatMessages.value.push({
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      isAiThinking.value = false;
    }, 600);
  };

  return {
    isAiThinking,
    chatInput,
    chatMessages,
    sendChatMessage,
  };
}
