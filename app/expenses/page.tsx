import { MainLayout } from "@/components/layout/main-layout"
import { ExpensesContent } from "./expenses-content"
import { requireAuth } from "@/lib/auth"

export default async function ExpensesPage() {
  // This will redirect to login if user is not authenticated
  await requireAuth()

  return (
    <MainLayout>
      <ExpensesContent />
    </MainLayout>
  )
}

