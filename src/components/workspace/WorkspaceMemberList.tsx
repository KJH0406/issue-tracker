"use client"

import { useEffect, useState } from "react"
import {
  fetchWorkspaceMembers,
  updateMemberRole,
  removeMember,
} from "@/lib/api/workspace"
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeleteConfirmModal } from "@/components/common/DeleteConfirmModal"

interface Member {
  id: string
  userId: string
  user: {
    username: string
    email: string
  }
  role: string
}

interface WorkspaceMemberListProps {
  workspaceSlug: string
  refreshKey?: number
  onRefresh?: () => void
}

export default function WorkspaceMemberList({
  workspaceSlug,
  refreshKey,
  onRefresh,
}: WorkspaceMemberListProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchWorkspaceMembers(workspaceSlug)
      .then((data) => setMembers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [workspaceSlug, refreshKey])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateMemberRole(workspaceSlug, userId, newRole)
      toast.success("역할이 변경되었습니다")

      // 역할 변경 후 로컬 상태 업데이트
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.userId === userId ? { ...member, role: newRole } : member
        )
      )

      // 부모 컴포넌트에 변경 알림 (선택적)
      if (onRefresh) onRefresh()
    } catch (e) {
      toast.error("역할 변경 실패")
    }
  }

  const openDeleteModal = (member: Member) => {
    setMemberToDelete(member)
    setDeleteModalOpen(true)
  }

  const handleRemove = async () => {
    if (!memberToDelete) return

    try {
      await removeMember(workspaceSlug, memberToDelete.userId)

      // 사용자 제거 후 로컬 상태 업데이트
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.userId !== memberToDelete.userId)
      )

      toast.success("사용자가 제거되었습니다")

      // 부모 컴포넌트에 변경 알림 (선택적)
      if (onRefresh) onRefresh()

      return Promise.resolve()
    } catch (e) {
      toast.error("제거 실패")
      return Promise.reject(e)
    }
  }

  if (loading) return <p>불러오는 중...</p>

  console.log(members)

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-gray-200 border rounded-md">
        {members.map((member) => (
          <li key={member.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{member.user.username}</p>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={member.role}
                  onValueChange={(newRole) =>
                    handleRoleChange(member.userId, newRole)
                  }
                >
                  <SelectTrigger className="w-[110px] text-sm">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">MEMBER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>

                <button
                  onClick={() => openDeleteModal(member)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setMemberToDelete(null)
        }}
        onConfirm={handleRemove}
        titlePrefix="사용자"
        resourceName={" "}
        descriptionContent={
          <>
            <span className="font-medium">
              {memberToDelete?.user.username || memberToDelete?.user.email}
            </span>{" "}
            사용자를 워크스페이스에서 제거하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </>
        }
      />
    </div>
  )
}
