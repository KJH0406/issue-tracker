"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Spinner } from "@/components/ui/spinner"
import { Building, Hash, AlertCircle, Check } from "lucide-react"

// 식별자 유효성 검사
const isValidSlug = (identifier: string) => /^[a-z0-9]{3,10}$/.test(identifier)
// 이름 유효성 검사
const isValidName = (name: string) => name.trim().length >= 2

// 워크스페이스 색상 옵션
const COLOR_OPTIONS = [
  { bg: "bg-indigo-100", text: "text-indigo-600", value: "indigo" },
  { bg: "bg-blue-100", text: "text-blue-600", value: "blue" },
  { bg: "bg-green-100", text: "text-green-600", value: "green" },
  { bg: "bg-amber-100", text: "text-amber-600", value: "amber" },
  { bg: "bg-rose-100", text: "text-rose-600", value: "rose" },
  { bg: "bg-purple-100", text: "text-purple-600", value: "purple" },
  { bg: "bg-teal-100", text: "text-teal-600", value: "teal" },
  { bg: "bg-cyan-100", text: "text-cyan-600", value: "cyan" },
  { bg: "bg-pink-100", text: "text-pink-600", value: "pink" },
  { bg: "bg-orange-100", text: "text-orange-600", value: "orange" },
]

// 워크스페이스 생성 폼
export default function CreateWorkspaceForm({
  setOpen,
  onSuccess,
}: {
  setOpen: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [name, setName] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [color, setColor] = useState(COLOR_OPTIONS[0].value)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // 식별자 유효성 검사
  useEffect(() => {
    if (!identifier) {
      setError("")
      return
    }

    if (!isValidSlug(identifier)) {
      setError("식별자는 3-10자의 영문 소문자와 숫자만 사용 가능합니다.")
    } else {
      setError("")
    }
  }, [identifier])

  // 워크스페이스 생성 요청
  const handleCreate = async () => {
    if (!name || !identifier || error) return

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        body: JSON.stringify({ name, identifier, color }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "워크스페이스 생성에 실패했습니다.")
        setIsSubmitting(false)
        return
      }

      toast.success("워크스페이스가 생성되었습니다.")
      setOpen(false)

      if (onSuccess) {
        onSuccess()
        router.push(`/workspace/${data.workspace.identifier}`)
      }
    } catch (err) {
      setError("서버와 통신 중 오류가 발생했습니다.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          워크스페이스 이름
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="name"
            placeholder="팀 또는 회사 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
          />
        </div>
        {!isValidName(name) && name && (
          <p className="text-sm text-amber-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            이름은 최소 2자 이상이어야 합니다.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-gray-700"
        >
          워크스페이스 식별자
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="identifier"
            placeholder="영문, 숫자 3-10자"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.toLowerCase())}
            className="pl-10"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          워크스페이스 색상
        </label>
        <div className="grid grid-cols-10 gap-2">
          {COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full aspect-square rounded-md flex items-center justify-center ${
                option.bg
              } ${option.text} border ${
                color === option.value
                  ? "border-gray-900"
                  : "border-transparent"
              }`}
              onClick={() => setColor(option.value)}
            >
              {color === option.value && <Check className="h-5 w-5" />}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleCreate}
          disabled={
            !name ||
            !identifier ||
            isSubmitting ||
            !!error ||
            !isValidName(name)
          }
          className="w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Spinner /> : "워크스페이스 생성"}
        </Button>
      </div>
    </div>
  )
}
