"use client"

import { useState } from "react"
import { createIssue } from "@/lib/api/issue"

import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// 이슈 생성 모달
export function IssueCreateModal({
  projectId,
  onCreated,
}: {
  projectId: string
  onCreated?: () => void
}) {
  // 이슈 폼 데이터
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // 이슈 생성 로딩 상태
  const [loading, setLoading] = useState(false)

  // 이슈 생성 핸들러
  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("제목은 필수입니다.")
      return
    }

    // 이슈 생성 로딩 상태 설정
    setLoading(true)

    // 이슈 생성 요청
    try {
      // 이슈 생성 API 호출
      await createIssue({ title, description, projectId })
      toast.success("이슈가 생성되었습니다.")

      // 이슈 폼 데이터 초기화
      setTitle("")
      setDescription("")

      // 이슈 생성 완료 콜백 호출
      onCreated?.()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 border rounded p-4">
      <Input
        placeholder="이슈 제목을 입력해주세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="설명을 입력해주세요."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleCreate} disabled={loading}>
        {loading ? "생성 중..." : "이슈 생성"}
      </Button>
    </div>
  )
}
