// src/app/(dashboard)/layout.tsx

import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
