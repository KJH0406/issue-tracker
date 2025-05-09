import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

// 공간 레이아웃
export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getAuthUser()

  // 인증된 사용자가 아니면 로그인 페이지로 리다이렉트
  if (!user) redirect("/login")
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
