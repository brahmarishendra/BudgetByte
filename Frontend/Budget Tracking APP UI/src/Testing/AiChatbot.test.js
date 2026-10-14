import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAiChatbot } from '@/Script/AiChatbot';

describe('AI Chatbot & Math Aggregations test file', () => {
  let chatbot;
  const mockContext = {
    filteredExpense: { value: 12500 },
    filteredIncome: { value: 45000 },
    formattedBalance: { value: '32,500.00' },
    transactions: {
      value: [
        { id: 1, type: 'income', amount: 45000, category: 'Salary' },
        { id: 2, type: 'expense', amount: 5000, category: 'Food' },
        { id: 3, type: 'expense', amount: 4500, category: 'Rent' },
        { id: 4, type: 'expense', amount: 3000, category: 'Shopping' },
      ],
    },
  };

  beforeEach(() => {
    vi.useFakeTimers();
    chatbot = useAiChatbot(mockContext);
  });

  // initial bot greeting
  it('gives initial greeting message on first mount', () => {
    expect(chatbot.chatMessages.value.length).toBe(1);
    expect(chatbot.chatMessages.value[0].sender).toBe('bot');
  });

  // testing math aggregation: average expense
  it('computes average expense and burn rate corectly', () => {
    chatbot.sendChatMessage('what is my average expense?');
    // user message is pushed right away
    expect(chatbot.chatMessages.value.length).toBe(2);
    expect(chatbot.isAiThinking.value).toBe(true);

    // fast forward timer for bot think
    vi.runAllTimers();

    expect(chatbot.isAiThinking.value).toBe(false);
    const botReply = chatbot.chatMessages.value[2].text;
    expect(botReply).toContain('Average spend per transaction');
    expect(botReply).toContain('Daily burn rate');
  });

  // testing savings rate percentage calculation
  it('calculate savings rate math percentage accurately', () => {
    chatbot.sendChatMessage('show my savings rate percent');
    vi.runAllTimers();

    const botReply = chatbot.chatMessages.value[2].text;
    expect(botReply).toContain('Savings Rate:');
    expect(botReply).toContain('Net Retained Savings');
  });

  // test category breakdown math
  it('breakdowns highest category spending properly', () => {
    chatbot.sendChatMessage('what is my category breakdown?');
    vi.runAllTimers();

    const botReply = chatbot.chatMessages.value[2].text;
    expect(botReply).toContain('Food');
    expect(botReply).toContain('Reasoning: Your highest spending category');
  });

  // test smart financial tips response
  it('provides actionable tips like 50/30/20 rule', () => {
    chatbot.sendChatMessage('give me some tips to save money');
    vi.runAllTimers();

    const botReply = chatbot.chatMessages.value[2].text;
    expect(botReply).toContain('50/30/20 Rule');
    expect(botReply).toContain('Emergency Cushion');
  });
});
