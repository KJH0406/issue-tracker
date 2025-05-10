import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { Sidebar } from "@/components/layout/Sidebar"
import { getAuthUser } from "@/lib/auth"

// 공간 홈 레이아웃
export default async function WorkspaceHomeLayout({
  children,
}: {
  children: ReactNode
}) {
  // 로그인 사용자 조회
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
