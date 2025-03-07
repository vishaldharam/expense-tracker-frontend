"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  categories,
  formatCurrency,
  getExpensesByCategory,
  getTotalExpenses,
  mockBudget,
} from "@/lib/utils";
import { useAddBudget, useUserDashboardDls } from "@/query/expense-and-budget";
import { useEffect } from "react";

const formSchema = z.object({
  Housing: z.coerce.number().nonnegative().default(0),
  Food: z.coerce.number().nonnegative().default(0),
  Transportation: z.coerce.number().nonnegative().default(0),
  Entertainment: z.coerce.number().nonnegative().default(0),
  Utilities: z.coerce.number().nonnegative().default(0),
  Other: z.coerce.number().nonnegative().default(0),
});
type BudgetFormValues = z.infer<typeof formSchema>;

export function BudgetContent() {
  const { getUserBudget, getUserExpense } = useUserDashboardDls();
  let totalExpenses = 0;
  getUserExpense?.data?.map((budget: any) => {
    totalExpenses += budget.amount;
  }); 
  let totalBudget = 0;
  let totalRemainingAmount = 0;
  getUserBudget?.data?.map((budget: any) => {
    totalBudget += budget.limit;
    totalRemainingAmount += budget.remainingAmount;
  });

  const budgetData = getUserBudget?.data || [];

  const mappedValues: BudgetFormValues = budgetData.reduce(
    (acc: any, budget: any) => ({
      ...acc,
      [budget.category]: budget.limit || 0,
    }),
    {
      Housing: 0,
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Utilities: 0,
      Other: 0,
    }
  );

  // Initialize form
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: mappedValues,
  });

  const addBudgetData = useAddBudget();
  useEffect(() => {
  
    if (budgetData.length > 0) {
      console.log("Setting values from budgetData:", mappedValues);
      form.reset(mappedValues);
    } 
  }, [budgetData, form]);
  

  function onSubmit(values: BudgetFormValues) {
    console.log("✅ Form submitted with values:", values);

    const budgetData = Object.entries(values)
      .filter(([key]) => key !== "total")
      .map(([category, limit]) => ({
        category,
        limit: Number(limit),
      }));

    addBudgetData.mutate(budgetData, {
      onSuccess: () => {
        getUserBudget.refetch();
      },
      onError: (error) => {
        console.error("Failed to update budget:", error);
      },
    });
  }

  const getTotalAmountByCategory = (category: string) => {
    return getUserExpense.data
      ?.filter((expense: any) => expense.category === category) // Filter by category
      .reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0; // Sum the amounts
  };
  
  
  
  const unallocated = totalRemainingAmount;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Budget</h2>
        <p className="text-muted-foreground">
          Manage your monthly budget allocation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Your current budget status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Total Budget</div>
                <div className="font-medium">
                  {formatCurrency(totalBudget || 0)}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>Total Expenses</div>
                <div className="font-medium">
                  {formatCurrency(totalExpenses || 0)}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>Remaining</div>
                <div className="font-medium">
                  {formatCurrency(totalRemainingAmount || 0)}
                </div>
              </div>
              <Progress
                value={(totalExpenses / totalBudget) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Category Breakdown</h4>
              {getUserBudget?.data?.map((category: any) => {
                const budgetAmount = category.limit;
                const expenseAmount = getTotalAmountByCategory(category.category) || 0
                const percentage =
                  budgetAmount > 0 ? (expenseAmount / budgetAmount) * 100 : 0;

                return (
                  <div key={category.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div>{category.category}</div>
                      <div className="font-medium">
                        {formatCurrency(expenseAmount)} /{" "}
                        {formatCurrency(budgetAmount)}
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Budget</CardTitle>
            <CardDescription>
              Adjust your monthly budget allocation
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Budget</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your total monthly budget
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Category Allocation</h4>
                  <div className="text-sm text-muted-foreground">
                    Unallocated: {formatCurrency(unallocated)}
                  </div>

                  {categories.map((category) => (
                    <FormField
                      key={category.value}
                      control={form.control}
                      name={category.value as keyof BudgetFormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{category.label}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
