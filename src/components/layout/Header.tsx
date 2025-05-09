"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { WorkspaceSelector } from "@/components/workspace/WorkspaceSelector"
import { Bell, Search, HelpCircle, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

// 헤더 컴포넌트
export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [username, setUsername] = useState("")

  useEffect(() => {
    // 사용자 정보 가져오기
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

    fetchUserInfo()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <header className="w-full px-6 py-3 border-b flex justify-between items-center bg-white shadow-sm sticky top-0 z-10">
      {/* 왼쪽: 서비스명 및 공간 선택 */}
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-primary flex items-center">
          Issue Tracker
        </div>
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

      {/* 오른쪽: 아이콘 및 프로필 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Settings className="h-5 w-5" />
        </Button>

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
