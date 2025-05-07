// src/components/layout/Header.tsx

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// 헤더 컴포넌트
export function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" }) // 로그아웃 API는 후속 구현 예정
    router.push("/login")
  }

  return (
    <header className="w-full px-6 py-3 border-b flex justify-between items-center">
      {/* 왼쪽: 서비스명 또는 로고 */}
      <div className="text-xl font-bold">MyPM</div>

      {/* 오른쪽: 프로필 및 로그아웃 */}
      <div className="flex items-center gap-4">
        {/* 향후 워크스페이스 선택 UI 자리 */}
        <span className="text-sm text-gray-600">username@example.com</span>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </header>
  )
}
