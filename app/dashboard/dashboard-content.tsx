"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  getCategoryColor,
  getExpensesByCategory,
  getTotalExpenses,
  mockBudget,
  mockExpenses,
} from "@/lib/utils";
import { useUserDashboardDls } from "@/query/expense-and-budget";

export function DashboardContent() {
  const { getUserBudget, getUserExpense } = useUserDashboardDls();
  let totalBudget = 0;
  let totalRemainingAmount = 0;
  getUserBudget?.data?.map((budget: any) => {
    totalBudget += budget.limit;
    totalRemainingAmount += budget.remainingAmount;
  });

  let totalExpenses = 0;

  getUserExpense?.data?.map((budget: any) => {
    totalExpenses += budget.amount;
  });

  const expensePercentage = (totalExpenses / totalBudget) * 100;

  const expensesByCategory = getExpensesByCategory(getUserExpense.data || []);

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
      color: getCategoryColor(category),
    })
  );

  const getTotalAmountByCategory = (category: string) => {
    return (
      getUserExpense.data
        ?.filter((expense: any) => expense.category === category) // Filter by category
        .reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0
    ); // Sum the amounts
  };

  const barChartData = getUserBudget.data?.map((budget: any) => {
    return {
      name: budget.category,
      budget: budget.limit,
      expenses: getTotalAmountByCategory(budget.category),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your expenses and budget
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">Monthly allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-destructive" />
              <span>{expensePercentage.toFixed(1)}% of budget</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRemainingAmount)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownIcon className="mr-1 h-4 w-4 text-green-500" />
              <span>
                {(100 - expensePercentage).toFixed(1)}% of budget left
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Distribution of your expenses</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Budget vs Expenses</CardTitle>
            <CardDescription>Comparison by category</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill="#4f46e5" name="Budget" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {getUserExpense.data?.slice(0, 5).map((expense: any) => (
              <div key={expense.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {expense.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {expense.date}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
