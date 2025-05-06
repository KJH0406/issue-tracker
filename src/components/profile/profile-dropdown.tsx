"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import JoinWorkspaceForm from "@/components/workspace/join-workspace-form"

// 프로필 드롭다운 메뉴
export default function ProfileDropdown({
  username,
  email,
}: {
  username: string
  email: string
}) {
  const [open, setOpen] = useState(false)
  const initial = username.charAt(0) || "U"

  return (
    <>
      <DropdownMenu>
        {/* 프로필 아바타 */}
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {initial}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/* 프로필 드롭다운 메뉴 */}
        <DropdownMenuContent align="end" className="w-56">
          {/* 프로필 정보 */}
          <div className="px-4 py-2 text-sm">
            <p className="font-semibold">{username}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>

          {/* 드롭다운 메뉴 구분선 */}
          <DropdownMenuSeparator />

          {/* 초대코드 입력 모달 */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            ✉ 초대 코드로 참가
          </DropdownMenuItem>

          {/* 로그아웃 버튼 */}
          <form action="/api/logout" method="POST" className="w-full">
            <DropdownMenuItem asChild>
              <button type="submit" className="w-full text-left">
                🚪 로그아웃
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 초대코드 입력 모달 */}
      <JoinWorkspaceForm open={open} setOpen={setOpen} />
    </>
  )
}
