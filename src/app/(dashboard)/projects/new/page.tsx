"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWorkspaceStore } from "@/stores/workspace"
import { createProject } from "@/lib/api/project"

// 새 프로젝트 생성 페이지
export default function NewProjectPage() {
  const router = useRouter()
  const workspace = useWorkspaceStore((state) => state.current)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!workspace || !name.trim()) {
      toast.error("워크스페이스가 없거나 이름이 비어 있습니다.")
      return
    }

    setLoading(true)
    try {
      await createProject({
        name,
        description,
        workspaceId: workspace.id,
      })

      toast.success("프로젝트가 생성되었습니다.")
      router.push("/projects")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">새 프로젝트 생성</h1>

      <Input
        placeholder="프로젝트 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="설명 (선택)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "생성 중..." : "프로젝트 생성"}
      </Button>
    </div>
  )
}
