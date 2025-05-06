"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// 로그인 페이지
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 로그인 요청
  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    // 로그인 성공 시 홈 페이지로 리다이렉트
    if (res.ok) {
      router.push("/")
    } else {
      const { error } = await res.json()
      alert(error)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <Input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2"
      />
      <Button onClick={handleLogin} className="mt-4 w-full">
        로그인
      </Button>
      <p className="mt-4 text-sm text-center">
        아직 회원이 아니신가요?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          회원가입하기
        </a>
      </p>
    </div>
  )
}
