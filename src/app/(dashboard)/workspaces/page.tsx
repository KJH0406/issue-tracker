// src/app/workspaces/page.tsx

"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

type Workspace = {
  id: string
  name: string
  description: string | null
  role: "ADMIN" | "MEMBER"
  createdAt: string
}

// 워크스페이스 목록 페이지
export default function WorkspaceListPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await fetch("/api/workspaces")
        const data = await res.json()

        if (!res.ok) throw new Error(data.message || "불러오기 실패")

        setWorkspaces(data.workspaces)
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">내 워크스페이스</h1>

      {loading ? (
        <p>불러오는 중...</p>
      ) : workspaces.length === 0 ? (
        <p>가입된 워크스페이스가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {workspaces.map((ws) => (
            <li
              key={ws.id}
              className="border p-4 rounded-xl hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{ws.name}</p>
                  <p className="text-sm text-gray-500">{ws.description}</p>
                </div>
                <span className="text-xs text-white bg-gray-700 px-2 py-1 rounded">
                  {ws.role}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
