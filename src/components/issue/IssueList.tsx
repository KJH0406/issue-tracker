"use client"

import { Issue } from "@/types/issue"
import { useRouter } from "next/navigation"
import { getStatusStyle } from "@/lib/utils"

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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-1/12"
              >
                일감 번호
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-5/12"
              >
                제목
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/12"
              >
                상태
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/12"
              >
                생성일
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/12"
              >
                생성자
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
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
                <tr
                  key={issue.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/workspace/${workspaceSlug}/project/${projectSlug}/issue/${issue.number}`
                    )
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{projectSlug}-{issue.number}
                  </td>
                  <td className="px-6 py-4">
                    <h3 className="font-medium text-gray-900">{issue.title}</h3>
                    {issue.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {issue.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        getStatusStyle(issue.status).color
                      }`}
                    >
                      {getStatusStyle(issue.status).label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.author?.username || "사용자"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
