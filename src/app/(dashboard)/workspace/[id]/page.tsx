import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
  Users,
  Settings,
  Plus,
  ListTodo,
  Calendar,
  BarChart4,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function WorkspacePage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getAuthUser()
  if (!user) return notFound()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            워크스페이스 이름
          </h1>
          <p className="text-gray-500 mt-1">식별자</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span>멤버 관리</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </Button>
        </div>
      </div>

      {/* 프로젝트 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">할 일</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            작업 목록을 관리하고 진행 상황을 추적하세요.
          </p>
          <Button variant="default" size="sm" className="w-full">
            보기
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">일정</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-full">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            팀 일정을 확인하고 중요한 마감일을 관리하세요.
          </p>
          <Button variant="default" size="sm" className="w-full">
            보기
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">대시보드</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-full">
              <BarChart4 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            프로젝트 진행 상황과 팀 성과를 분석하세요.
          </p>
          <Button variant="default" size="sm" className="w-full">
            보기
          </Button>
        </div>
      </div>

      {/* 새 프로젝트 생성 카드 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
          <Plus className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          새 프로젝트 생성
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-md">
          새로운 프로젝트를 생성하여 팀과 함께 작업을 시작하세요.
        </p>
        <Button>프로젝트 생성</Button>
      </div>
    </div>
  )
}
