"use client"

import { useState } from "react"
import { createIssue } from "@/lib/api/issue"
import { toast } from "react-hot-toast"
import { PlusIcon, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Issue } from "@/types/issue"

// 이슈 생성 모달
export function IssueCreateModal({
  workspaceSlug,
  projectSlug,
  onCreated,
}: {
  workspaceSlug: string
  projectSlug: string
  onCreated?: (newIssue: Issue) => void
}) {
  // 이슈 폼 데이터
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // 모달 열기 상태
  const [isOpen, setIsOpen] = useState(false)

  // 이슈 생성 로딩 상태
  const [loading, setLoading] = useState(false)

  // 이슈 생성 핸들러
  const handleCreate = async () => {
    setLoading(true)

    try {
      const newIssue = await createIssue({
        title,
        description,
        workspaceSlug,
        projectSlug,
      })

      // 생성된 이슈 객체를 전달
      onCreated?.(newIssue)
      setIsOpen(false)
      toast.success("이슈가 성공적으로 생성되었습니다.")
      // 폼 초기화
      setTitle("")
      setDescription("")
    } catch (error) {
      console.error("이슈 생성 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  // 모달 닫기 핸들러
  const handleClose = () => {
    if (loading) return // 로딩 중에는 닫기 방지
    setIsOpen(false)
  }

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
      >
        <PlusIcon className="w-4 h-4" />새 이슈 생성
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">새 이슈 생성</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="이슈 제목을 입력해주세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <Textarea
                  placeholder="이슈에 대한 상세 설명을 입력해주세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  취소
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading || !title.trim()}
                >
                  {loading ? "생성 중..." : "이슈 생성"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
