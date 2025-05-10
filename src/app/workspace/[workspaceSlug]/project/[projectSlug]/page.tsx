"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import { IssueList } from "@/components/issue/IssueList"
import { IssueCreateModal } from "@/components/issue/IssueCreateModal"
import { getIssues } from "@/lib/api/issue"
import { Issue } from "@/types/issue"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// 프로젝트 홈 페이지
export default function ProjectHomePage() {
  // URL 파라미터 추출
  const { workspaceSlug, projectSlug } = useParams()
  // 이슈 목록 상태
  const [issues, setIssues] = useState<Issue[]>([])
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true)
  // 모달 열기 상태
  const [isOpen, setIsOpen] = useState(false)

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
  }, [])

  // 이슈 생성 후 목록에 직접 추가
  const handleIssueCreated = (newIssue: Issue) => {
    setIssues((prevIssues) => [newIssue, ...prevIssues])
  }

  return (
    <div className="space-y-6 mx-auto w-full">
      {/* 이슈 목록 헤더 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">프로젝트 이슈</h1>
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />새 이슈 생성
        </Button>
      </div>

      {/* 이슈 목록 */}
      <IssueList
        issues={issues}
        loading={loading}
        projectSlug={projectSlug as string}
        workspaceSlug={workspaceSlug as string}
      />

      {/* 이슈 생성 모달 */}
      <IssueCreateModal
        workspaceSlug={workspaceSlug as string}
        projectSlug={projectSlug as string}
        onCreated={handleIssueCreated}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  )
}
