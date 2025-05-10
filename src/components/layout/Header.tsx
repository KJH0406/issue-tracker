"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, Search, HelpCircle, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { WorkspaceSelector } from "@/components/workspace/WorkspaceSelector"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 헤더 컴포넌트
export function Header() {
  const router = useRouter()
  const pathname = usePathname() // 현재 경로
  const [username, setUsername] = useState("") // 사용자 이름

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/user")
        if (res.ok) {
          const data = await res.json()
          setUsername(data.username)
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error)
      }
    }

    // 페이지 로드 시 사용자 정보 가져오기
    fetchUserInfo()
  }, [])

  // 로그아웃 처리
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    // 로그아웃 이후 로그인 페이지로 리다이렉트
    router.push("/login")
  }

  return (
    <header className="w-full px-6 py-3 border-b flex justify-between items-center bg-white shadow-sm sticky top-0 z-10">
      {/* 서비스명 및 공간 셀렉터 */}
      <div className="flex items-center gap-4">
        {/* 서비스명 */}
        <Link
          href="/workspace"
          className="text-xl font-bold text-primary flex items-center"
        >
          Issue Tracker
        </Link>

        {/* 공간 셀렉터 */}
        {pathname.includes("/workspace/") && (
          <div className="ml-6">
            <WorkspaceSelector />
          </div>
        )}
      </div>

      {/* 중앙: 검색창 */}
      {/* <div className="max-w-md w-full mx-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이슈 검색 (Ctrl+K)"
            className="pl-8 bg-gray-50 focus:bg-white"
          />
        </div>
      </div> */}

      {/* 부가 기능 영역 */}
      <div className="flex items-center gap-2">
        {/* 도움말 버튼 */}
        <Button variant="ghost" size="icon" className="text-gray-500">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* 알림 버튼 */}
        <Button variant="ghost" size="icon" className="text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* 설정 버튼 */}
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Settings className="h-5 w-5" />
        </Button>

        {/* 프로필 버튼 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt={username} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {username ? username.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>프로필</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>설정</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
