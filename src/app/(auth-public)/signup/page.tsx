"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { AtSign, User, Lock, ArrowRight } from "lucide-react"

type Errors = {
  email?: string
  username?: string
  password?: string
  form?: string
}

// 회원가입 페이지
export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  // 회원가입 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Errors = {}
    if (!email) newErrors.email = "이메일을 입력해주세요."
    else if (!email.includes("@"))
      newErrors.email = "올바른 이메일 형식이 아닙니다."

    if (!username) newErrors.username = "사용자 이름을 입력해주세요."

    if (!password) newErrors.password = "비밀번호를 입력해주세요."
    else if (password.length < 6)
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    // 회원가입 요청
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
      })
      const data = await res.json()
      // 회원가입 실패 시 오류 메시지 표시
      if (!res.ok) {
        setErrors({ form: data.error || "회원가입에 실패했습니다." })
        toast.error(data.error || "회원가입에 실패했습니다.")
        setLoading(false)
        return
      }
      // 회원가입 성공 시 로그인 페이지로 리다이렉트
      router.push("/login")
      toast.success("회원가입에 성공했습니다.")
    } catch {
      setErrors({ form: "서버와 통신 중 오류가 발생했습니다." })
      toast.error("서버와 통신 중 오류가 발생했습니다.")
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">회원가입</h2>

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
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                사용자 이름
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  placeholder="사용자 이름을 입력해주세요."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`pl-10 ${
                    errors.username ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
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
              {loading ? "회원가입 중..." : "회원가입"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 회원이신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  )
}
