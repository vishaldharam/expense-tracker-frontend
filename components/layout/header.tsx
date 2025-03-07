"use client"

import Link from "next/link"
import { Menu, PieChart, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"
import { UserAccountNav } from "@/components/auth/user-account-nav"

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 dark:bg-gray-950">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <PieChart className="h-6 w-6" />
          <span>Rxpense</span>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button asChild variant="default" size="sm" className="h-8 gap-1">
          <Link href="/expenses/add">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Expense</span>
          </Link>
        </Button>
        <UserAccountNav />
      </div>
    </header>
  )
}

