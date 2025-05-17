"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getStatusStyle } from "@/lib/utils"
import { getIssue, updateIssueStatus } from "@/lib/api/issue"
import { IssueStatus } from "@prisma/client"
import { ArrowLeft } from "lucide-react"
import { toast } from "react-hot-toast"

// 이슈 상세 페이지
export function IssueDetail() {
  const router = useRouter()
  const { workspaceSlug, projectSlug, issueNumber } = useParams()
  const [issue, setIssue] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchIssue = async () => {
      // 이슈 불러오기
      try {
        const issue = await getIssue(
          Number(issueNumber),
          workspaceSlug as string,
          projectSlug as string
        )
        setIssue(issue)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchIssue()
  }, [workspaceSlug, projectSlug, issueNumber])

  // 이슈 상태 변경
  const handleChangeStatus = async (newStatus: string) => {
    if (!issue) return
    setUpdating(true)
    try {
      const updatedIssue = await updateIssueStatus(
        issue.id,
        newStatus as IssueStatus
      )

      console.log(updatedIssue)

      setIssue(updatedIssue) // 상태 즉시 반영
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      toast.success("이슈 상태가 변경되었습니다.")
      setUpdating(false)
    }
  }

  if (loading) return <p>이슈 불러오는 중...</p>
  if (error) return <p className="text-red-500">오류: {error}</p>
  if (!issue) return <p>이슈 없음</p>

  // 이슈 상태 스타일
  const status = getStatusStyle(issue.status)

  // 이슈 목록으로 돌아가는 함수
  const goBackToIssueList = () => {
    router.push(`/workspace/${workspaceSlug}/project/${projectSlug}`)
  }
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* 헤더 영역 - 뒤로가기 버튼 */}
      <div className="flex items-center">
        <button
          onClick={goBackToIssueList}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          이슈 목록
        </button>
      </div>
      {/* 이슈 번호 */}
      <span className="text-gray-500 text-sm">
        #{projectSlug}-{issue.number}
      </span>
      {/* 이슈 제목 */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">{issue.title}</h1>
      </div>

      {/* 메타데이터 그리드 */}
      <div className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* 상태 */}
        <div className="flex items-center">
          <div className="w-32 text-sm text-gray-500">상태</div>
          <div>
            <select
              value={issue.status}
              onChange={(e) => handleChangeStatus(e.target.value)}
              disabled={updating}
              className={`border rounded-md px-3 py-1.5 text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            >
              {Object.values(IssueStatus).map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 담당자 */}
        <div className="flex items-center">
          <div className="w-32 text-sm text-gray-500">담당자</div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-600">
              {issue.author?.username?.charAt(0) || "?"}
            </div>
            <span className="ml-2 text-sm">
              {issue.author?.username || "미배정"}
            </span>
          </div>
        </div>

        {/* 날짜 */}
        <div className="flex items-center">
          <div className="w-32 text-sm text-gray-500">날짜</div>
          <div className="text-sm">
            {new Date(issue.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      {/* 설명 영역 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">설명</h3>
        <div className="prose prose-sm max-w-none">
          {issue.description ? (
            <p className="text-gray-700 whitespace-pre-wrap">
              {issue.description}
            </p>
          ) : (
            <p className="text-gray-400 italic">설명 없음</p>
          )}
        </div>
      </div>
    </div>
  )
}
