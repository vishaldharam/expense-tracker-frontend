"use client";

import dataProvider from "@/dataProvider";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

let fetcher = dataProvider("userInstance");

const getUserDashboardDls = () => {
  return fetcher.get(`/budgets`);
};

const getUserExpensedDls = () => {
  return fetcher.get("/expenses");
};

const getUserExpensedWithId = (id: string) => {
return fetcher.get(`/expenses/${id}`)
}

// API function to add budget
async function addBudget(budgetData: any[]) {
  const response = await fetcher.post("/budgets", budgetData); // Adjust API URL
  return response.data;
}

async function addExpense(expenseData: any) {
  try {
    const response = await fetcher.post("/expenses", expenseData);
    return response;
  } catch (error: any) {
    console.error(
      "API Error:",
      error?.response?.data ||
        error.message ||
        "Not sufficient budget for category"
    );
    throw new Error(error?.response?.data?.message || "Failed to edit expense.");
  }
}

async function deleteExpense(id: string) {
  try {
    const response = await fetcher.delete(`/expenses/${id}`);
    return response;
  } catch (error: any) {
    console.error(
      "API Error:",
      error?.response?.data ||
        error.message ||
        "Cannot delete the expense for category"
    );
    throw new Error(error?.response?.data?.message || "Failed to delete expense.");
  }
}

async function editExpense({id, payload}: any) {
  console.log("data on going", payload)
  try {
    const response = await fetcher.put(`/expenses/${id}`, payload);
    return response;
  } catch (error: any) {
    console.error(
      "API Error:",
      error?.response?.data ||
        error.message ||
        "Not sufficient budget for category"
    );
    throw new Error(error?.response?.data?.message || "Failed to add expense.");
  }
}

export const useUserDashboardDls = () => {
  const getUserBudget = useQuery({
    queryKey: ["budget"],
    queryFn: () => getUserDashboardDls(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: (data) => {
      return data.data;
    },
  });

  const getUserExpense = useQuery({
    queryKey: ["expense"],
    queryFn: () => getUserExpensedDls(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: (data) => {
      return data.data;
    },
  });

  return { getUserBudget, getUserExpense };
};

export const useExpenseWithId = (id: string) => {
  const getUserExpenseWithId = useQuery({
    queryKey: ["expense-id", id],
    queryFn: () => getUserExpensedWithId(id),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: (data) => {
      return data.data;
    },
  });
  return { getUserExpenseWithId };
};

export function useAddBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatedBudget"],
    mutationFn: addBudget, // Directly pass the function
    onSuccess: () => {},
    onError: (error) => {
      console.error("Failed to update budget:", error);
    },
  });
}

export function useAddExpense() {
  const { getUserExpense } = useUserDashboardDls();
  return useMutation({
    mutationKey: ["addExpense"],
    mutationFn: addExpense,
    onSuccess: () => {
      getUserExpense.refetch();
    },
    onError: (error: any) => {
      console.error("Failed to create expenses:", error.message);
    },
  });
}

export function useEditExpense() {
  const { getUserExpense } = useUserDashboardDls();
  return useMutation({
    mutationKey: ["editexpense"],
    mutationFn: editExpense,
    onSuccess: () => {
      getUserExpense.refetch();
    },
    onError: (error: any) => {
      console.error("Failed to edit expenses:", error.message);
    },
  });
}


export function useDeleteExpense() {
  const { getUserExpense } = useUserDashboardDls();
  return useMutation({
    mutationKey: ["delete-expense"],
    mutationFn: deleteExpense,
    onSuccess: () => {
      getUserExpense.refetch();
    },
    onError: (error: any) => {
      console.error("Failed to delete expenses:", error.message);
    },
  });
}
