"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createWorkspace } from "@/lib/api/workspace"

// 새 워크스페이스 만들기 페이지
export default function NewWorkspacePage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("워크스페이스 이름을 입력해주세요.")
      return
    }

    setLoading(true)

    try {
      await createWorkspace({ name, description })

      toast.success("워크스페이스가 생성되었습니다!")
      router.push("/workspaces")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">새 워크스페이스 만들기</h1>

      <Input
        placeholder="워크스페이스 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="설명 (선택)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button onClick={handleCreate} disabled={loading}>
        {loading ? "생성 중..." : "생성하기"}
      </Button>
    </div>
  )
}
