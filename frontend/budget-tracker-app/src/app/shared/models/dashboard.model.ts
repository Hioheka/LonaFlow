export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  expensesByCategory: CategoryExpense[];
  monthlyTrends: MonthlyTrend[];
  expensesByPaymentMethod: PaymentMethodExpense[];
}

export interface CategoryExpense {
  categoryName: string;
  categoryColor?: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  netBalance: number;
}

export interface PaymentMethodExpense {
  paymentMethodName: string;
  amount: number;
  percentage: number;
}
