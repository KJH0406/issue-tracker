"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// 헤더 컴포넌트
export function Header() {
  const router = useRouter()
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
    <header className="w-full px-6 py-3 border-b flex justify-between items-center">
      {/* 왼쪽: 서비스명 또는 로고 */}
      <div className="text-xl font-bold">Issue Tracker</div>

      {/* 오른쪽: 프로필 및 로그아웃 */}
      <div className="flex items-center gap-4">
        {/* 향후 워크스페이스 선택 UI 자리 */}
        <span className="text-sm text-gray-600">
          {username || "로딩 중..."}
        </span>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </header>
  )
}
