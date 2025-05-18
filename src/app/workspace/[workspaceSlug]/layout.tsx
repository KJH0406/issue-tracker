import { ReactNode } from "react"
import { Sidebar } from "@/components/layout/Sidebar"

// 공간 홈 레이아웃
export default async function WorkspaceHomeLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
