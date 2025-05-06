import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react"

export default async function DashboardPage() {
  const user = await getAuthUser()

  // 실제 구현에서는 DB에서 데이터를 가져오는 로직이 필요합니다
  const recentWorkspaces = await prisma.member.findMany({
    where: { userId: user?.userId },
    include: { workspace: true },
    take: 3,
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          안녕하세요, {user?.username}님 👋
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">활성 프로젝트</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
              <LayoutDashboard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-500 mt-1">총 15개 중</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              진행 중인 작업
            </h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-full">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-500 mt-1">오늘 마감 2개</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">완료된 작업</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-full">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-500 mt-1">이번 주 완료</p>
        </div>
      </div>

      {/* 최근 워크스페이스 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            최근 워크스페이스
          </h2>
        </div>
        <div className="divide-y">
          {recentWorkspaces.map(({ workspace }) => (
            <Link
              key={workspace.id}
              href={`/workspace/${workspace.identifier}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {workspace.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {workspace.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {workspace.identifier}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            href="/workspace"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            모든 워크스페이스 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 알림 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">최근 알림</h2>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">
                마감일이 임박한 작업이 있습니다
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                "디자인 시스템 업데이트" 작업의 마감일이 내일까지입니다.
              </p>
              <div className="mt-3">
                <Link
                  href="/tasks/123"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  작업 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
