"use client"

import { useState } from "react"
import { UserWithStatus } from "@/types/workspace"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import WorkspaceInviteSearch from "./WorkspaceInviteSearch"
import WorkspaceInviteList from "./WorkspaceInviteList"

interface WorkspaceInviteModalProps {
  isOpen: boolean
  onClose: () => void
  workspaceSlug: string
  onInviteSuccess: () => void
}

export default function WorkspaceInviteModal({
  isOpen,
  onClose,
  workspaceSlug,
  onInviteSuccess,
}: WorkspaceInviteModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<UserWithStatus[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleSelect = (users: UserWithStatus[]) => {
    const newUser = users[0]
    if (!selectedUsers.find((u) => u.id === newUser.id)) {
      // 기본 역할 설정
      const userWithRole = { ...newUser, role: "MEMBER" }
      setSelectedUsers((prev) => [...prev, userWithRole])
    }
  }

  const handleRemove = (id: string) => {
    if (id === "all") {
      setSelectedUsers([])
      return
    }
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setSelectedUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    )
  }

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast.error("초대할 사용자를 선택해주세요.")
      return
    }

    setSubmitting(true)

    try {
      // 여러 사용자를 한 번에 추가하는 API 호출
      const usersToInvite = selectedUsers.map((user) => ({
        email: user.email,
        role: user.role || "MEMBER",
      }))

      const res = await fetch(`/api/workspaces/${workspaceSlug}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usersToInvite),
      })

      const data = await res.json()

      // 결과 처리 (오류가 있는 경우 처리 가능)
      if (!res.ok && res.status !== 207) {
        throw new Error("초대 실패")
      }

      // 성공 시 초기화 및 모달 닫기
      setSelectedUsers([])
      onInviteSuccess()
      // 상세한 결과 피드백
      if (data.results && data.results.length > 0) {
        toast.success(`${data.results.length}명의 사용자를 초대했습니다.`)
      }

      // 오류가 있는 경우 표시
      if (data.errors && data.errors.length > 0) {
        toast.error(`${data.errors.length}명의 사용자 초대에 실패했습니다.`)
      }

      onClose()
    } catch (error) {
      console.error("초대 실패:", error)
      toast.error("초대 처리 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">
            워크스페이스 사용자 초대
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            서비스를 이용 중인 사용자를 검색하여 워크스페이스에 초대할 수
            있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <WorkspaceInviteSearch
            workspaceSlug={workspaceSlug}
            onSelect={handleSelect}
          />

          <div className="flex flex-col">
            <WorkspaceInviteList
              users={selectedUsers}
              onRemove={handleRemove}
              onRoleChange={handleRoleChange}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            disabled={submitting || selectedUsers.length === 0}
            onClick={handleSubmit}
          >
            {submitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                초대 처리 중...
              </span>
            ) : (
              `${
                selectedUsers.length > 0 ? selectedUsers.length + "명 " : ""
              }초대하기`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
