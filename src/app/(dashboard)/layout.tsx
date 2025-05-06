import { ReactNode } from "react"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getAuthUser()
  if (!user) redirect("/login")

  console.log(user)

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 영역 */}
      <header className="flex justify-between items-center border-b px-4 py-2 bg-white">
        <div className="text-xl font-semibold text-gray-800">
          🧭 issue-tracker
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-4">
          {/* 사용자 정보 */}
          <span>👤 {user.username}</span>
          {/* 로그아웃 버튼 */}
          <form action="/api/logout" method="POST">
            <button type="submit" className="text-red-500 hover:underline">
              로그아웃
            </button>
          </form>
        </div>
      </header>

      {/* 바디 영역: 사이드바 + 컨텐츠 */}
      <div className="flex flex-1">
        {/* 사이드바 영역 */}
        <aside className="w-64 bg-gray-100 border-r p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline">
                대시보드 홈(/)
              </Link>
            </li>
            <li>
              <Link href="/workspace" className="hover:underline">
                워크스페이스(/workspace)
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:underline">
                설정(/settings)
              </Link>
            </li>
          </ul>
        </aside>

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
