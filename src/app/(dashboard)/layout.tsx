import { ReactNode } from "react"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProfileDropdown from "@/components/profile/profile-dropdown"
import WorkspaceSelector from "@/components/workspace/workspace-selector"
import {
  LayoutDashboard,
  Settings,
  Inbox,
  Calendar,
  Users,
  FileText,
  Search,
  Plus,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CreateProjectModal from "@/components/project/create-project-modal"
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getAuthUser()
  if (!user) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="flex justify-between items-center border-b px-4 py-2 bg-white shadow-sm h-14">
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold text-indigo-600">
            🧭 issue-tracker
          </div>
          <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
          <WorkspaceSelector />
        </div>

        {/* 검색 및 프로필 */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="검색..."
              className="pl-9 w-64 bg-gray-100 border-gray-200 focus:bg-white"
            />
          </div>
          <ProfileDropdown username={user.username} email={user.email} />
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-16 md:w-56 bg-white border-r flex flex-col transition-all duration-200">
          <nav className="p-2 flex-1">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 group transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                  <span className="hidden md:inline font-medium">대시보드</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 group transition-colors"
                >
                  <FileText className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                  <span className="hidden md:inline font-medium">프로젝트</span>
                </Link>
              </li>
              <li>{/* <CreateProjectModal />   */}</li>
              <li>
                <Link
                  href="/calendar"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 group transition-colors"
                >
                  <Calendar className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                  <span className="hidden md:inline font-medium">일정</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/inbox"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 group transition-colors"
                >
                  <Inbox className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                  <span className="hidden md:inline font-medium">메시지</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 group transition-colors"
                >
                  <Users className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                  <span className="hidden md:inline font-medium">팀</span>
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 group transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                    <span className="hidden md:inline font-medium">설정</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
