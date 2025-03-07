import { MainLayout } from "@/components/layout/main-layout"
import { DashboardContent } from "./dashboard-content"
import { requireAuth } from "@/lib/auth"

export default async function DashboardPage() {
  // This will redirect to login if user is not authenticated
  await requireAuth()

  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  )
}

