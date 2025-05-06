"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AtSign, Lock, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            🧭 issue-tracker
          </h1>
          <p className="text-gray-600 mt-2">
            프로젝트 관리를 더 쉽고 효율적으로
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">로그인</h2>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errors.form}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          아직 회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  )
}
