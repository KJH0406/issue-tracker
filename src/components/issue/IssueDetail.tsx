"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getStatusStyle } from "@/lib/utils"
import { getIssue } from "@/lib/api/issue"
import { Issue } from "@/types/issue"

// 이슈 상세 페이지
export function IssueDetail() {
  const { workspaceSlug, projectSlug, issueNumber } = useParams()
  const router = useRouter()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 이슈 상세 조회
    const fetchIssue = async () => {
      try {
        const issue = await getIssue(
          Number(issueNumber),
          workspaceSlug as string,
          projectSlug as string
        )

        // 이슈 상세 조회 성공 시 이슈 데이터 설정
        setIssue(issue)
      } catch (err: any) {
        // 이슈 상세 조회 실패 시 오류 설정
        setError(err.message)
      } finally {
        // 이슈 상세 조회 완료 시 로딩 상태 설정
        setLoading(false)
      }
    }

    // 이슈 상세 조회 실행
    fetchIssue()
  }, [workspaceSlug, projectSlug, issueNumber])

  // 이슈 목록으로 돌아가는 함수
  const goBackToIssueList = () => {
    router.push(`/workspace/${workspaceSlug}/project/${projectSlug}`)
  }

  if (loading) return <p>이슈 불러오는 중...</p>
  if (error) return <p className="text-red-500">오류: {error}</p>
  if (!issue) return <p>이슈 없음</p>

  // 이슈 상태 스타일 가져오기
  const status = getStatusStyle(issue.status)

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
      <div className="text-sm text-gray-500">
        #{issue.number} · {issue.author?.username || "알 수 없음"} ·{" "}
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
        >
          {status.label}
        </span>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">
        {issue.description || "설명 없음"}
      </p>
    </div>
  )
}
