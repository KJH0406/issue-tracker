"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { createProject } from "@/lib/api/project"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Workspace } from "@/types/workspace"
import { getWorkspaces } from "@/lib/api/workspace"

// 새 프로젝트 생성 페이지
export default function NewProjectPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedId, setSelectedId] = useState<string>("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 워크스페이스 목록 조회
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaces = await getWorkspaces()
      setWorkspaces(workspaces)
    }

    fetchWorkspaces()
  }, [])

  // 프로젝트 생성 핸들러
  const handleSubmit = async () => {
    if (!name || !selectedId) {
      toast.error("모든 항목을 입력해주세요.")
      return
    }

    setLoading(true)
    try {
      await createProject({
        name,
        description,
        workspaceId: selectedId,
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

      <select
        className="w-full border rounded px-3 py-2 text-sm"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">워크스페이스 선택</option>
        {workspaces.map((ws) => (
          <option key={ws.id} value={ws.id}>
            {ws.name}
          </option>
        ))}
      </select>

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
