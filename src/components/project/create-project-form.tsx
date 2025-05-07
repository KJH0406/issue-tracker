"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// 프로젝트 생성 폼
export default function CreateProjectForm({
  workspaceId,
  workspaceIdentifier,
}: {
  workspaceId: string
  workspaceIdentifier: string
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // 프로젝트 생성 함수
  const handleCreate = async () => {
    setError("")

    if (!name || name.length < 2) {
      setError("프로젝트 이름은 최소 2자 이상이어야 합니다.")
      return
    }

    setIsSubmitting(true)

    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        workspaceId,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      // 생성된 프로젝트로 이동
      router.push(
        `/workspace/${workspaceIdentifier}/project/${data.project.id}`
      )
    } else {
      setError(data.error || "프로젝트 생성 중 오류가 발생했습니다.")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">프로젝트 생성</h2>

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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={handleCreate} disabled={isSubmitting} className="w-full">
        {isSubmitting ? "생성 중..." : "생성하기"}
      </Button>
    </div>
  )
}
