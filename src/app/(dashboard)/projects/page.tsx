"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { getProjects } from "@/lib/api/project"
import { useWorkspaceStore } from "@/stores/workspace"
import { Project } from "@/types/project"
import Link from "next/link"

// 프로젝트 목록 페이지
export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const workspace = useWorkspaceStore((state) => state.current)

  useEffect(() => {
    const fetch = async () => {
      if (!workspace) return

      setLoading(true)
      try {
        const data = await getProjects(workspace.id)
        setProjects(data)
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [workspace?.id])

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">프로젝트 목록</h1>

        <Link href="/projects/new">
          <div className="font-semibold text-blue-500">프로젝트 생성하기</div>
        </Link>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-sm">
          해당 워크스페이스에 프로젝트가 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="border p-4 rounded hover:bg-gray-50"
            >
              <p className="font-semibold">{project.name}</p>
              <p className="text-sm text-gray-500">{project.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
