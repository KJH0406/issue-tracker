"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { joinWorkspace } from "@/lib/api/workspace"
import { Spinner } from "@/components/ui/spinner"
import { KeyRound, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"

// 초대 코드로 참가 모달
export default function JoinWorkspaceForm({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // 코드 입력 시 에러 초기화
  useEffect(() => {
    if (code) setError("")
  }, [code])

  // 워크스페이스 참가 요청
  const handleSubmit = async () => {
    if (!code) {
      setError("초대 코드를 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await joinWorkspace(code)

      if (response.error) {
        setError(response.error)
        setIsSubmitting(false)
        return
      }

      toast.success("워크스페이스에 참가했습니다.")
      setOpen(false)
      router.push(`/workspace/${response.workspace.identifier}`)
    } catch (err) {
      setError("서버와 통신 중 오류가 발생했습니다.")
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-semibold text-gray-900">
          워크스페이스 참가
        </DialogTitle>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            초대 코드를 입력하여 워크스페이스에 참가하세요.
          </p>

          <div className="space-y-2">
            <label
              htmlFor="invite-code"
              className="block text-sm font-medium text-gray-700"
            >
              초대 코드
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="invite-code"
                placeholder="초대 코드 입력"
                value={code}
                onChange={(e) => setCode(e.currentTarget.value)}
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

          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !code}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Spinner /> : "워크스페이스 참가"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
