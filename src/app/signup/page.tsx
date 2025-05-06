"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// 회원가입 페이지
export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // 회원가입 요청
  const handleRegister = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    })

    // 회원가입 성공 시 로그인 페이지로 리다이렉트
    if (res.ok) {
      router.push("/login")
    } else {
      const { error } = await res.json()
      alert(error)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <Input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="사용자 이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-2"
      />
      <Input
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2"
      />
      <Button onClick={handleRegister} className="mt-4 w-full">
        회원가입
      </Button>
      <p className="mt-4 text-sm text-center">
        이미 회원이신가요?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          로그인하기
        </a>
      </p>
    </div>
  )
}
