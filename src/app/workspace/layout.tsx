import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { getAuthUser } from "@/lib/auth"

import { Header } from "@/components/layout/Header"

// 공간 루트 레이아웃
export default async function WorkspaceRootLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getAuthUser()

  // 로그인 사용자가 아니면 로그인 페이지로 리다이렉트
  if (!user) redirect("/login")

  return (
    <div className="h-screen flex flex-col">
      <Header />
      {children}
    </div>
  )
}
