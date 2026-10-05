<script setup>
import { Home } from '@/Script/Home.js';
import { usePieChart } from '@/Charts/PieChart';
import PieChart from '@/Charts/PieChart.vue';
import BarChart from '@/Charts/BarChart.vue';

const {
  despia,
  isDespia,
  showBalance,
  activeTab,
  transactions,
  isLoadingTransactions,
  showTransactionModal,
  showProfileModal,
  showTransactions,
  //editingTransaction,
  searchQuery,
  selectedValue,
  selectedDate,
  selectedMonth,
  selectedYear,
  TotalExpenses,
  TotalIncomes,
  clear_date,
  income,
  expense,
  uploadImage,
  fileInputRef,
  triggerFileSelect,
  handleFileChange,
  profile,
  profileDraft,
  isSubmitting,
  formMessage,
  formError,
  formData,
  formattedBalance,
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
  exportToExcel,
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
} = Home();

const {
  pieData,
        pieChartOptions,
        hasPieData,
        loadingPie,
        errorPie,
        fetchPieData,
        highestExpenseCategory
} = usePieChart(transactions);

const navigateTo = (tab) => {
  activeTab.value = tab;
  if (tab === 'Dashboard') fetchPieData();
};

const getCategoryIcon = (category, type) => {
  const cat = String(category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('grocer') || cat.includes('eat') || cat.includes('dine')) return '🍽️';
  if (cat.includes('uber') || cat.includes('travel') || cat.includes('car') || cat.includes('fuel')) return '🚗';
  if (cat.includes('salary') || cat.includes('pay') || cat.includes('income')) return '💰';
  if (cat.includes('internet') || cat.includes('wifi') || cat.includes('fiber')) return '📶';
  if (cat.includes('elect') || cat.includes('power') || cat.includes('utility')) return '⚡';
  if (cat.includes('water')) return '💧';
  if (cat.includes('rent') || cat.includes('home')) return '🏠';
  if (cat.includes('shop') || cat.includes('store') || cat.includes('cloth')) return '🛍️';
  if (cat.includes('music') || cat.includes('spotify') || cat.includes('movie')) return '🎵';
  return type === 'income' ? '↗️' : '💳';
};
</script>

<template>
  <main class="dashboard-shell" :class="{ 'profile-active': activeTab === 'Profile' }">
    <!-- Top Floating Header -->
    <header class="topbar">
      <div class="profile-block" @click="activeTab = 'Profile'">
        <div class="avatar-ring">
          <img class="profile-image" :src="uploadImage"  alt="Profile" />
          <span class="online-dot"></span>
        </div>
        <div class="profile-text">
          <span class="eyebrow">Good Morning 👋</span>
          <strong class="profile-name">{{ profile.name }}</strong>
        </div>
      </div>
      <div class="top-actions">
        <button class="icon-btn" title="Add New Transaction" @click="openTransactionModal('expense')">
          <span class="plus-icon">+</span>
        </button>
        <button class="icon-btn ai-bot-btn" title="Open AI Assistant" @click="navigateTo('AI')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 18h6"></path>
            <path d="M10 22h4"></path>
            <path d="M9 9a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V9Z"></path>
            <path d="M5 12a7 7 0 0 1 14 0"></path>
            <path d="M8 12h.01"></path>
            <path d="M16 12h.01"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- TAB 1: HOME TAB (Balance & Transaction List) -->
    <section v-if="activeTab === 'Home'" class="tab-view home-view">
      <!-- Total Balance Hero Card -->
      <div class="hero-balance-card">
        <div class="hero-header">
          <div class="balance-tag">
            <span class="pulse-dot"></span>
            <span>Total Balance</span>
          </div>
          <button class="visibility-toggle" @click="showBalance = !showBalance" :title="showBalance ? 'Hide balance' : 'Show balance'">
            <svg v-if="showBalance" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        </div>

        <div class="balance-display">
          <span class="currency">Rs.</span>
          <span class="amount-number">{{ showBalance ? formattedBalance : '••••••••' }}</span>
        </div>

        <div class="balance-status-row">
          <span class="trend-badge positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            Total  : {{TotalExpenses()}}
          </span>
          <span v-if="isDespia" class="despia-pill">Despia Native</span>
        </div>

        <!-- Quick Action Buttons -->
        <div class="quick-action-row">
          <button class="pill-action-btn primary" @click="openTransactionModal('income')">
            <span class="btn-icon">↓</span>
            <span>+ Deposit</span>
          </button>
          <button class="pill-action-btn secondary" @click="openTransactionModal('expense')">
            <span class="btn-icon">↑</span>
            <span>↗ Transfer</span>
          </button>
          <button class="pill-action-btn icon-only" title="Export Excel" @click="exportToExcel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Controls -->
      <section class="controls-panel">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="searchQuery" 
            type="search" 
            placeholder="Search transactions..." 
            class="search-input" 
          />
        </div>
        <div class="filter-pills-row mb-14">
        <!-- Type filter -->
        <div class="select-pill-wrapper">
            <select class="filter-select" v-model="selectedValue">
                   <option value="all">More Actions...</option>
               <option value="income">Income</option>
               <option value="expense">Expense</option>
           </select>
        </div>

        <!-- Month filter -->
        <div class="select-pill-wrapper">
          <select v-model="selectedMonth" class="filter-select">
            <option value="all">🗓️ All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div class="date-filter-control">
          <svg class="date-filter-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2"></rect>
            <path d="M16 3v4M8 3v4M3 11h18"></path>
          </svg>
          <input
            type="date"
            v-model="selectedDate"
            class="date-input"
            aria-label="Filter transactions by date"
          />
          <button type="button" class="date-clear-btn" aria-label="Clear date filter" title="Clear date filter" @click="clear_date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="m18 6-12 12M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      </section>
      

      <!-- Transactions List -->
      <section class="transactions-section">
        <div class="section-title-bar">
          <div>
            <h3 class="section-title">Transactions</h3>
            <span class="count-pill">{{ filteredCount }} items</span>
          </div>
          <button class="see-all-btn" @click="showTransactions = !showTransactions">
            {{ showTransactions ? 'Show less' : 'View all' }}
          </button>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isLoadingTransactions" class="skeleton-list">
          <div v-for="i in 3" :key="i" class="skeleton-item">
            <div class="skeleton-circle"></div>
            <div class="skeleton-lines">
              <div class="skeleton-line line-1"></div>
              <div class="skeleton-line line-2"></div>
            </div>
            <div class="skeleton-line line-3"></div>
          </div>
        </div>

        <!-- Real Transactions Items -->
        <div v-else class="transaction-cards-list">
          <div 
            v-for="transaction in (showTransactions ? filteredTransactions : filteredTransactions.slice(0, 5))" 
            :key="transaction.id" 
            class="tx-card" >
            <div class="tx-icon-col" :class="transaction.type">
              {{ getCategoryIcon(transaction.category, transaction.type) }}
            </div>
            <div class="tx-details">
              <strong class="tx-category">{{ transaction.category }}</strong>
              <span class="tx-meta">{{ transaction.description }} • {{ transaction.date }}</span>
              <span v-if="transaction.comments" class="tx-meta">Comment: {{ transaction.comments }}</span>
            </div>
            <div class="tx-amount-col">
              <!-- Income / Expense dot indicator -->
              <span 
                class="tx-type-dot" 
                :class="transaction.type === 'income' ? 'dot-income' : 'dot-expense'"
                :title="transaction.type === 'income' ? 'Income' : 'Expense'"
              ></span>
              <div class="tx-amount" :class="transaction.type" >
                {{ transaction.type === 'income' ? '+' : '-' }}Rs. {{ formatAmount(transaction.amount) }}  
              </div>
         
              <div class="tx-actions">
                 <!--
                <button class="action-btn edit-btn" title="Edit" @click="openEditTransactionModal(transaction)">Edit</button>
              -->
                <button class="action-btn del-btn" title="Delete" @click="deleteTransaction(transaction)">Delete</button>
              </div>
            </div>
          </div>

          <div v-if="!filteredTransactions.length" class="empty-state-box">
            <div class="empty-icon">📂</div>
            <p class="empty-title">No transactions found</p>
            <small>Tap + above to record a new transaction.</small>
          </div>
        </div>
      </section>
    </section>

    <!-- TAB 2: DASHBOARD TAB (All Dashboard Metrics & Analytics from image!) -->
    <section v-else-if="activeTab === 'Dashboard'" class="tab-view dashboard-view">
      <!-- Filter Row in Dashboard -->
      <!--<div class="filter-pills-row mb-14">
        <div class="select-pill-wrapper">
          <select v-model="selectedYear" class="filter-select">
            <option value="all">📅 All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div> -->

        

      <!-- 2x2 Metric Cards (Border radius 4px) -->
      <div class="metrics-grid">
        <!-- Monthly Income Card -->
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-title">Monthly Income</span>
            <span class="metric-icon-bubble income">↗</span>
          </div>
          <div class="metric-value">Rs. {{ formatAmount(filteredIncome) }}</div>
          <div class="metric-sub">
            <span class="pill-tag green">+Income</span>
            <small>filtered</small>
          </div>
        </div>

        <!-- Monthly Expense Card -->
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-title">Monthly Expense</span>
            <span class="metric-icon-bubble expense">↘</span>
          </div>
          <div class="metric-value">Rs. {{ formatAmount(filteredExpense) }}</div>
          <div class="metric-sub">
            <span class="pill-tag red">-Expense</span>
            <small>spent</small>
          </div>
        </div>

        <!-- Net Savings Card -->
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-title">Net Savings</span>
            <span class="metric-icon-bubble net">⚖</span>
          </div>
          <div class="metric-value" :class="{ negative: filteredNet < 0 }">
            {{ filteredNet < 0 ? '-' : '' }}Rs. {{ formatAmount(Math.abs(filteredNet)) }}
          </div>
          <div class="metric-sub">
            <span class="pill-tag" :class="filteredNet >= 0 ? 'green' : 'red'">
              {{ filteredNet >= 0 ? 'Positive' : 'Deficit' }}
            </span>
            <small>net cash</small>
          </div>
        </div>

        <!-- Total Orders / Transactions Card -->
        <div class="metric-card">
          <div class="metric-top">
            <span class="metric-title">Total Orders</span>
            <span class="metric-icon-bubble count">📦</span>
          </div>
          <div class="metric-value">{{ filteredCount }}</div>
          <div class="metric-sub">
            <span class="pill-tag blue">Transactions</span>
            <small>in filter</small>
          </div>
        </div>
      </div>

      <!-- Spending Analytics Bar Section (Border radius 4px) -->
      <div class="charts-wrapper">
        <article class="charts-card cashflow-chart-card">
          <div class="charts-header">
            <div>
              <h2 class="charts-title">Monthly spending</h2>
              <p class="charts-sub">Your spending over time</p>
            </div>
            <span class="charts-badge-tag">6 months</span>
          </div>
          <div class="chart-period-summary">
            <div><span>Total spent</span><strong>Rs. {{ formatAmount(sixMonthExpense) }}</strong></div>
            <span class="chart-period-note">Monthly</span>
          </div>
          <div class="chart-container">
            <!-- Monthly spending bar chart showing expense totals for the last 6 months. -->
            <BarChart :data="monthlyBarData" :options="monthlyBarOptions" :plugins="chartPlugins" />
          </div>
        </article>

        <article class="charts-card category-chart-card">
          <div class="charts-header">
            <div>
              <h2 class="charts-title">Spending by category</h2>
              <p class="charts-sub">How your expenses are distributed</p>
            </div>
            <span class="charts-badge-tag">Top: {{ highestExpenseCategory }}</span>
          </div>
          <div class="chart-container pie-chart-container">
            <div v-if="loadingPie" class="chart-loading">
              <div class="loader"></div>
              <p>Loading chart data...</p>
            </div>
            <div v-else-if="errorPie" class="chart-error">
              <p>Failed to load chart data</p>
              <button @click="fetchPieData">Retry</button>
            </div>
            <p v-else-if="!hasPieData" class="chart-empty">No expenses to show yet.</p>
            <PieChart v-else :data="pieData" :options="pieChartOptions" />
          </div>
        </article>
      </div>
    </section>
    
    <!-- TAB 3: AI CHATBOT TAB -->
    <div v-else-if="activeTab === 'AI'" class="ai-overlay">
      <section class="tab-view ai-view">
        <header class="assistant-topbar">
          <button type="button" class="assistant-back-btn" aria-label="Back to home" @click="navigateTo('Home')">
            <span aria-hidden="true">←</span>
          </button>
          <div class="assistant-brand">
            <span class="assistant-mark" aria-hidden="true"><span></span></span>
            <strong>BudgetByte AI</strong>
          </div>
          <span class="assistant-status"><span></span> Ready to help</span>
        </header>

        <div v-if="!chatMessages.length" class="assistant-welcome">
          <div class="assistant-glow" aria-hidden="true"><span></span></div>
          <h1>What can I help you<br>with today?</h1>
          <p>Ask about your spending, income, or ways to save.</p>
          <div class="assistant-prompts">
            <button class="assistant-prompt" @click="sendChatMessage('How much did I spend this month?')"><span>◷</span>Monthly spend</button>
            <button class="assistant-prompt" @click="sendChatMessage('What is my total income?')"><span>↗</span>Total income</button>
            <button class="assistant-prompt" @click="sendChatMessage('What is my highest expense category?')"><span>▦</span>Top category</button>
            <button class="assistant-prompt" @click="sendChatMessage('Give me tips to save money')"><span>✳</span>Saving tips</button>
          </div>
        </div>

        <div v-else class="assistant-conversation">
          <p class="assistant-context">Your budget assistant</p>
          <div class="chat-feed">
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              :class="['chat-bubble-wrap', msg.sender]"
            >
              <span v-if="msg.sender === 'bot'" class="chat-avatar">B</span>
              <div class="chat-bubble">
                <p class="chat-text">{{ msg.text }}</p>
                <span class="chat-time">{{ msg.time }}</span>
              </div>
            </div>

            <div v-if="isAiThinking" class="chat-bubble-wrap bot">
              <span class="chat-avatar">B</span>
              <div class="chat-bubble thinking">
                <span class="dot-flashing"></span>
                <span class="dot-flashing"></span>
                <span class="dot-flashing"></span>
              </div>
            </div>
          </div>
        </div>

        <form class="chat-input-bar" @submit.prevent="sendChatMessage()">
          <input
            v-model="chatInput"
            type="text" 
            placeholder="Ask me anything"
            class="chat-text-input"
            aria-label="Message BudgetByte AI"
          />
          <button type="submit" class="chat-send-btn" :disabled="!chatInput.trim()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </section>
    </div>

    <!-- TAB 4: PROFILE TAB -->
    <section v-else-if="activeTab === 'Profile'" class="tab-view profile-view">
      <div class="profile-card-full">
        <div class="profile-avatar-large">
          <button type="button" class="profile-avatar-trigger" aria-label="Choose profile photo" @click="triggerFileSelect">
            <img :src="uploadImage" alt="Profile photo" />
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            hidden
            @change="handleFileChange"
          />
        </div>

        <h2 class="profile-card-name">{{ profile.name }}</h2>
        <span class="profile-card-email">{{ profile.email }}</span>
        
        <div class="profile-stats-bar">
          <div class="stat-box">
            <span class="stat-num">{{ transactions.length }}</span>
            <span class="stat-label">Total Txns</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">Rs. {{ formattedBalance }}</span>
            <span class="stat-label">Balance</span>
          </div>
        </div>

        <div class="profile-actions-list">
          <button class="profile-menu-item" @click="openProfileModal">
            <span class="menu-icon">✏️</span>
            <span class="menu-label">Edit Profile Details</span>
            <span class="menu-arrow">›</span>
          </button>
          <button class="profile-menu-item" @click="exportToExcel">
            <span class="menu-icon">📊</span>
            <span class="menu-label">Export All to Excel (.csv)</span>
            <span class="menu-arrow">›</span>
          </button>
          <button class="profile-menu-item logout-item" @click="logout">
            <span class="menu-icon">🚪</span>
            <span class="menu-label">Log Out of Account</span>
            <span class="menu-arrow">›</span>
          </button>
        </div>
      </div>
    </section>

    <!-- FLOATING DOCK NAVBAR (Home, Dashboard, AI Bot, Profile) -->
    <nav v-show="activeTab !== 'AI'" class="floating-dock-nav" aria-label="Bottom Navigation">
      <button 
        :class="['dock-tab-btn', { active: activeTab === 'Home' }]" 
        @click="navigateTo('Home')"
      >
        <span class="dock-icon">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </span>
        <span class="dock-text">Home</span>
      </button>

      <button 
        :class="['dock-tab-btn', { active: activeTab === 'Dashboard' }]" 
        @click="navigateTo('Dashboard')"
      >
        <span class="dock-icon">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </span>
        <span class="dock-text">Dashboard</span>
      </button>
<!--
      <button 
        :class="['dock-tab-btn', { active: activeTab === 'AI' }]" 
        @click="navigateTo('AI')"
      >
        <span class="dock-icon">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
          </svg>
        </span>
        <span class="dock-text">AI Bot</span>
      </button>
    -->

      <button 
        :class="['dock-tab-btn', { active: activeTab === 'Profile' }]" 
        @click="navigateTo('Profile')"
      >
        <span class="dock-icon">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </span>
        <span class="dock-text">Profile</span>
      </button>
    </nav>

    <!-- TRANSACTION ADD / EDIT MODAL (Border radius 4px) -->
    <Transition name="modal-pop">
      <div v-if="showTransactionModal" class="modal-backdrop" @click.self="closeTransactionModal">
        <form class="modal-sheet" @submit.prevent="form">
          <button type="button" class="modal-close-circle" aria-label="Close" @click="closeTransactionModal">×</button>
          <!--
          <div class="modal-header">
            <span class="modal-badge-pill">{{ editingTransaction ? 'Update Entry' : (formData.type === 'income' ? 'Income' : 'Expense') }}</span>
            <h2 class="modal-title">{{ editingTransaction ? 'Edit Transaction' : (formData.type === 'income' ? 'Add Deposit Money' : 'Add New Expense') }}</h2>
          </div> -->

          <div class="modal-body-fields">
            <div class="type-segment">
              <button 
                type="button" 
                :class="['segment-btn', { active: formData.type === 'expense' }]" 
                @click="formData.type = 'expense'"
              >
                Expense
              </button>
              <button 
                type="button" 
                :class="['segment-btn', { active: formData.type === 'income' }]" 
                @click="formData.type = 'income'"
              >
                Income
              </button>
            </div>

            <div class="form-field">
              <label>Amount (Rs.)</label>
              <input 
                v-model.number="formData.amount" 
                type="number" 
                min="0.01" 
                step="0.01" 
                placeholder="e.g. 500.00" 
                required 
                autofocus 
              />
            </div>

            <div class="form-field">
              <label>Category</label>
              <input 
                v-model="formData.category" 
                type="text" 
                placeholder="e.g. Groceries, Rent, Salary, Fuel" 
                required 
              />
            </div>

            <div class="form-field">
              <label>Description</label>
              <input 
                v-model="formData.description" 
                type="text" 
                placeholder="e.g. Supermarket shopping" 
                required 
              />
            </div>

            <div class="form-field">
              <label>Comments (optional)</label>
              <textarea
                v-model="formData.comments"
                maxlength="1000"
                rows="3"
                placeholder="Add a note about this transaction"
              ></textarea>
            </div>

            <div class="form-field">
              <label>Date</label>
              <input 
                v-model="formData.date" 
                type="date" 
                required 
              />
            </div>
          </div>
          <button class="save-submit-btn" type="submit" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Confirm & Add</span>
            <span v-else class="btn-spinner"></span>
          </button>

          <p v-if="formMessage" class="form-msg success">{{ formMessage }}</p>
          <p v-if="formError" class="form-msg error">{{ formError }}</p>
        </form>
      </div>
    </Transition>

    <!-- PROFILE EDIT MODAL (Border radius 4px) -->
    <Transition name="modal-pop">
      <div v-if="showProfileModal" class="modal-backdrop" @click.self="showProfileModal = false">
        <form class="modal-sheet" @submit.prevent="saveProfile">
          <button type="button" class="modal-close-circle" aria-label="Close" @click="showProfileModal = false">×</button>
          
          <div class="modal-header">
            <span class="modal-badge-pill">Account</span>
            <h2 class="modal-title">Edit Profile</h2>
          </div>

          <div class="modal-body-fields">
            <div class="form-field">
              <label>Full Name</label>
              <input v-model="profileDraft.name" type="text" required placeholder="Your full name" />
            </div>
            <div class="form-field">
              <label>Email Address</label>
              <input v-model="profileDraft.email" type="email" required placeholder="name@email.com" />
            </div>
          </div>

          <button class="save-submit-btn" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </Transition>
  </main>
</template>

<style scoped src="@/styles/Home.css"></style>