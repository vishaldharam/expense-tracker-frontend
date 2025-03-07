"use client"
import { MainLayout } from "@/components/layout/main-layout"
import { ExpenseForm } from "../expense-form"
import { useAddExpense } from "@/query/expense-and-budget";

export default function AddExpensePage() {
    const addExpenseData = useAddExpense();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Expense</h2>
          <p className="text-muted-foreground">Create a new expense record</p>
        </div>

        <ExpenseForm mutateData={addExpenseData} />
      </div>
    </MainLayout>
  )
}

