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
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <button
        onClick={goBackToIssueList}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        이슈 목록으로 돌아가기
      </button>
      <h1 className="text-2xl font-bold">{issue.title}</h1>
      <div className="text-sm text-gray-500 space-x-2">
        #{issue.number} · {issue.author?.username || "알 수 없음"}
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* 상태 변경 드롭다운 */}
      <select
        value={issue.status}
        onChange={(e) => handleChangeStatus(e.target.value)}
        disabled={updating}
        className="border rounded px-3 py-2"
      >
        {Object.values(IssueStatus).map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>

      <p className="text-gray-700 whitespace-pre-wrap">
        {issue.description || "설명 없음"}
      </p>
    </div>
  )
}
