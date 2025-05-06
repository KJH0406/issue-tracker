"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Errors = {
  email?: string
  password?: string
  form?: string
}

// 로그인 페이지
export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  // 로그인 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    const newErrors: Errors = {}
    // 이메일 검증
    if (!email) newErrors.email = "이메일을 입력해주세요."
    else if (!email.includes("@"))
      newErrors.email = "올바른 이메일 형식이 아닙니다."
    // 비밀번호 검증
    if (!password) newErrors.password = "비밀번호를 입력해주세요."
    // 폼 에러 존재 시 오류 메시지 표시
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    // 로딩 상태 설정
    setLoading(true)

    // 로그인 요청
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      // 로그인 실패 시 오류 메시지 표시
      if (!res.ok) {
        setErrors({ form: data.error || "로그인에 실패했습니다." })
        setLoading(false)
        return
      }
      // 로그인 성공 시 홈 페이지로 리다이렉트
      router.push("/")
    } catch {
      setErrors({ form: "서버와 통신 중 오류가 발생했습니다." })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <form noValidate onSubmit={handleSubmit}>
        {/* 이메일 입력 */}
        <label htmlFor="email" className="block mb-1 font-medium">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

        {/* 비밀번호 입력 */}
        <label htmlFor="password" className="block mt-4 mb-1 font-medium">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        {/* 폼 에러 */}
        {errors.form && (
          <p className="text-red-600 text-center mt-4">{errors.form}</p>
        )}

        {/* 제출 버튼 */}
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "로딩 중…" : "로그인"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-center">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          회원가입하기
        </Link>
      </p>
    </div>
  )
}
