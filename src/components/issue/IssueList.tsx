"use client"

import { CalendarIcon, Link } from "lucide-react"
import { Issue } from "@/types/issue"
import { useRouter } from "next/navigation"

// 이슈 목록 컴포넌트
export function IssueList({
  issues,
  loading,
  projectSlug,
  workspaceSlug,
}: {
  issues: Issue[]
  loading: boolean
  projectSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <p className="text-gray-500">
          아직 이슈가 없습니다. 새 이슈를 생성해보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden w-full">
      <div className="bg-gray-100 px-6 py-3 border-b">
        <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-600">
          <div className="col-span-1">일감 번호</div>
          <div className="col-span-5">제목</div>
          <div className="col-span-3">생성일</div>
          <div className="col-span-2">생성자</div>
        </div>
      </div>
      <ul className="divide-y">
        {issues.map((issue) => {
          const createdDate = new Date(issue.createdAt).toLocaleDateString(
            "ko-KR",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )

          return (
            <li
              key={issue.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                router.push(
                  `/workspace/${workspaceSlug}/project/${projectSlug}/issue/${issue.number}`
                )
              }}
            >
              <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-sm text-gray-500">
                  #{projectSlug}-{issue.number}
                </div>
                <div className="col-span-5">
                  <h3 className="font-medium text-gray-900">{issue.title}</h3>
                  {issue.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {issue.description}
                    </p>
                  )}
                </div>
                <div className="col-span-3 text-sm text-gray-500 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {createdDate}
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {issue.author?.username || "사용자"}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
