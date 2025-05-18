"use client"

import { UserWithStatus } from "@/types/workspace"
import { X, User } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  users: UserWithStatus[]
  onRemove: (id: string) => void
  onRoleChange: (userId: string, newRole: string) => void
}

export default function WorkspaceInviteList({
  users,
  onRemove,
  onRoleChange,
}: Props) {
  const containerStyle = "border rounded-md h-[250px] w-full"

  if (users.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            초대 예정 사용자 (0명)
          </h4>
        </div>

        {/* Empty case에도 동일한 컨테이너 스타일 적용 */}
        <div className={`${containerStyle} flex items-center justify-center`}>
          <div className="text-center p-6">
            <User className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-muted-foreground">
              초대할 사용자를 검색하여 추가해주세요.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          초대 예정 사용자 ({users.length}명)
        </h4>
        {users.length > 0 && (
          <button
            onClick={() => onRemove("all")}
            className="text-xs text-red-500 hover:underline"
          >
            모두 지우기
          </button>
        )}
      </div>

      {/* 사용자 리스트에도 동일한 컨테이너 스타일 적용 */}
      <div className={`${containerStyle} overflow-hidden`}>
        <ul className="h-full overflow-y-auto divide-y">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center px-3 py-2 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={user.role || "MEMBER"}
                  onValueChange={(value) => onRoleChange(user.id, value)}
                >
                  <SelectTrigger className="w-28 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                    <SelectItem value="MEMBER">멤버</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => onRemove(user.id)}
                  className="text-sm text-red-500 hover:bg-red-50 p-1 rounded"
                  title="제거"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
