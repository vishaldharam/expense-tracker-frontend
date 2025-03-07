import { MainLayout } from "@/components/layout/main-layout"
import { AuthStatus } from "@/components/auth/auth-status"
import { requireAuth } from "@/lib/auth"

export default async function SettingsPage() {
  // This will redirect to login if user is not authenticated
  const user = await requireAuth()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="rounded-md border p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Name: {user.name}</p>
                <p className="text-sm font-medium">Email: {user.email}</p>
                <AuthStatus />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

