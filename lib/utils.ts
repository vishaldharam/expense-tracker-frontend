import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock data for the application
export const mockBudget = {
  total: 2000,
  categories: {
    housing: 800,
    food: 400,
    transportation: 200,
    entertainment: 150,
    utilities: 250,
    other: 200,
  },
}

export const mockExpenses = [
  {
    id: "1",
    title: "Rent",
    amount: 800,
    category: "housing",
    date: "2023-05-01",
  },
  {
    id: "2",
    title: "Groceries",
    amount: 120,
    category: "food",
    date: "2023-05-03",
  },
  {
    id: "3",
    title: "Gas",
    amount: 45,
    category: "transportation",
    date: "2023-05-05",
  },
  {
    id: "4",
    title: "Movie tickets",
    amount: 30,
    category: "entertainment",
    date: "2023-05-07",
  },
  {
    id: "5",
    title: "Electricity bill",
    amount: 95,
    category: "utilities",
    date: "2023-05-10",
  },
  {
    id: "6",
    title: "Internet bill",
    amount: 70,
    category: "utilities",
    date: "2023-05-10",
  },
  {
    id: "7",
    title: "Dinner out",
    amount: 65,
    category: "food",
    date: "2023-05-12",
  },
  {
    id: "8",
    title: "New headphones",
    amount: 80,
    category: "other",
    date: "2023-05-15",
  },
]

export const categories = [
  { value: "Housing", label: "Housing" },
  { value: "Food", label: "Food" },
  { value: "Transportation", label: "Transportation" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Utilities", label: "Utilities" },
  { value: "Other", label: "Other" },
]

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Housing: "#4f46e5",
    Food: "#10b981",
    Transportation: "#f59e0b",
    Entertainment: "#ec4899",
    Utilities: "#6366f1",
    Other: "#64748b",
  }
  return colors[category] || colors.other
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};


export const getTotalExpenses = () => {
  return mockExpenses.reduce((total, expense) => total + expense.amount, 0)
}

export const getExpensesByCategory = (data: any) => {
  const expensesByCategory: Record<string, number> = {}

  data?.forEach((expense: any) => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount
    } else {
      expensesByCategory[expense.category] = expense.amount
    }
  })

  return expensesByCategory
}

