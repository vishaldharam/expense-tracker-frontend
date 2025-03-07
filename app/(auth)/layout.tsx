import type React from "react"
import { PieChart } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-muted/40 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/5 z-0"></div>
        <div className="relative z-10 w-full max-w-[450px] p-8">
          <div className="flex items-center gap-2 mb-8">
            <PieChart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Rxpense Tracker</h1>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Take control of your finances</h2>
            <p className="text-muted-foreground mb-4">
              Track expenses, manage budgets, and gain insights into your spending habits.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Easy Tracking</h3>
                <p className="text-sm text-muted-foreground">Record expenses on the go</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Budget Planning</h3>
                <p className="text-sm text-muted-foreground">Set and manage your budgets</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Visual Reports</h3>
                <p className="text-sm text-muted-foreground">See where your money goes</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Smart Insights</h3>
                <p className="text-sm text-muted-foreground">Get spending recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  )
}

