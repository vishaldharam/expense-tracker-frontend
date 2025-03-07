"use client";

import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/utils";
import { useUserDashboardDls } from "@/query/expense-and-budget";
import { useEffect, useState } from "react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  date: z.string(),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  expense?: {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
  };
  mutateData: any;
}

export function ExpenseForm({ expense, mutateData }: ExpenseFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "",
      date: new Date().toISOString().split("T")[0], // Set today's date initially
    },
  });
  const { getUserExpense } = useUserDashboardDls();

  // Update form values when expense data is available
  useEffect(() => {
    if (expense) {
      form.reset({
        title: expense.title || "",
        amount: expense.amount || 0,
        category: expense.category || "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [expense, form]);
  function onSubmit(values: ExpenseFormValues) {

    const expenseData = {
      title: values.title,
      amount: values.amount,
      category: values.category,
    };

    // ✅ If editing an expense, send both `id` and `expenseData`
    if (expense?.id) {
      mutateData.mutate(
        { id: expense.id, payload: expenseData }, // Corrected structure
        {
          onSuccess: () => {
            getUserExpense.refetch();
            router.push("/expenses");
            setError(""); // ✅ Clear error on success
          },
          onError: (error: any) => {
            setError(error.message || "Something went wrong!"); // ✅ Show user-friendly error
          },
        }
      );
    } else {
      // ✅ Creating a new expense
      mutateData.mutate(expenseData, {
        onSuccess: () => {
          getUserExpense.refetch();
          router.push("/expenses");
          setError(""); // ✅ Clear error on success
        },
        onError: (error: any) => {
          console.error("Failed to create expense:", error);
          setError(error.message || "Something went wrong!"); // ✅ Show user-friendly error
        },
      });
    }

  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? "Edit Expense" : "New Expense"}</CardTitle>
        <CardDescription>
          {expense
            ? "Update the details of your expense"
            : "Enter the details of your new expense"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Rent, Groceries, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    A short description of the expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The amount spent.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The category of the expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    The date when the expense occurred.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error.length !== 0 && (
              <FormDescription className="text-red-500">
                {error}{" "}
              </FormDescription>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/expenses")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {expense ? "Update Expense" : "Create Expense"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
