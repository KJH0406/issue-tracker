"use client"

import { getProjects } from "@/lib/api/project"
import { getWorkspaces } from "@/lib/api/workspace"
import { Workspace } from "@/types/workspace"
import { Project } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// 프로젝트 목록 페이지
export default function ProjectListPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  // 워크스페이스 목록 조회
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaces = await getWorkspaces()
      setWorkspaces(workspaces)
    }
    fetchWorkspaces()
  }, [])

  // 선택된 워크스페이스에 속한 프로젝트 목록 조회
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedId) return
      setLoading(true)
      try {
        const projects = await getProjects(selectedId)
        setProjects(projects)
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [selectedId])

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">프로젝트 목록</h1>

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
