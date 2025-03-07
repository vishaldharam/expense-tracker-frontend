"use client"
import { use } from "react";
import { useExpenseWithId, useEditExpense } from "@/query/expense-and-budget";
import { MainLayout } from "@/components/layout/main-layout";
import { ExpenseForm } from "../../expense-form";

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ Unwrapping the params object
  const { getUserExpenseWithId } = useExpenseWithId(id);
  const editExpenseData = useEditExpense();

  console.log("det", getUserExpenseWithId.data);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Expense</h2>
          <p className="text-muted-foreground">Update expense details</p>
        </div>

        <ExpenseForm
          mutateData={editExpenseData}
          expense={getUserExpenseWithId.data ?? {}}
        />
      </div>
    </MainLayout>
  );
}
