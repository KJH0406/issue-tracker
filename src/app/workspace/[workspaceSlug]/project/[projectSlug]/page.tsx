"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import { IssueList } from "@/components/issue/IssueList"
import { IssueCreateModal } from "@/components/issue/IssueCreateModal"
import { getIssues } from "@/lib/api/issue"
import { Issue } from "@/types/issue"

// 프로젝트 홈 페이지
export default function ProjectHomePage() {
  // URL 파라미터 추출
  const { workspaceSlug, projectSlug } = useParams()
  // 이슈 목록 상태
  const [issues, setIssues] = useState<Issue[]>([])
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true)

  // 이슈 목록 불러오기
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true)
      try {
        const data = await getIssues(
          workspaceSlug as string,
          projectSlug as string
        )
        setIssues(data)
      } catch (err) {
        console.error("이슈 불러오기 실패:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [workspaceSlug, projectSlug])

  // 이슈 생성 후 목록에 직접 추가
  const handleIssueCreated = (newIssue: Issue) => {
    setIssues((prevIssues) => [newIssue, ...prevIssues])
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">프로젝트 이슈</h1>
        <IssueCreateModal
          workspaceSlug={workspaceSlug as string}
          projectSlug={projectSlug as string}
          onCreated={handleIssueCreated}
        />
      </div>

      {/* 이슈 목록 */}
      <IssueList issues={issues} loading={loading} />
    </div>
  )
}
