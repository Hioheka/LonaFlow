export enum TransactionType {
  Income = 1,
  Expense = 2
}

export enum PaymentMethodType {
  Credit = 1,
  CreditCard = 2,
  Cash = 3,
  OverdraftAccount = 4
}

export enum RecurrenceFrequency {
  Daily = 1,
  Weekly = 2,
  Monthly = 3
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  transactionDate: Date;
  description: string;
  notes?: string;
  categoryId?: number;
  categoryName?: string;
  paymentMethodId?: number;
  paymentMethodName?: string;
  creditorId?: number;
  creditorName?: string;
  isRecurring: boolean;
  createdAt: Date;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  transactionDate: Date;
  description: string;
  notes?: string;
  categoryId?: number;
  paymentMethodId?: number;
  creditorId?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Creditor {
  id: number;
  name: string;
  contactInfo?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: PaymentMethodType;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface RecurringTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  notes?: string;
  frequency: RecurrenceFrequency;
  startDate: Date;
  endDate?: Date;
  nextDueDate?: Date;
  categoryId?: number;
  categoryName?: string;
  paymentMethodId?: number;
  paymentMethodName?: string;
  creditorId?: number;
  creditorName?: string;
  isActive: boolean;
  createdAt: Date;
}

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
