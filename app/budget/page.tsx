import { MainLayout } from "@/components/layout/main-layout"
import { BudgetContent } from "./budget-content"
import { requireAuth } from "@/lib/auth"

export default async function BudgetPage() {
  // This will redirect to login if user is not authenticated
  await requireAuth()

  return (
    <MainLayout>
      <BudgetContent />
    </MainLayout>
  )
}

