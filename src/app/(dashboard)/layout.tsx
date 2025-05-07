// src/app/(dashboard)/layout.tsx

import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()
  if (!user) {
    redirect("/login")
  }
  return (
    <div className="h-screen flex flex-col">
      {/* 상단 헤더 */}
      <Header />

      {/* 왼쪽 사이드바 + 페이지 내용 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
