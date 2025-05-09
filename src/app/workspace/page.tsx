"use client"

import { useEffect, useState } from "react"
import { getWorkspaces } from "@/lib/api/workspace"
import { Workspace } from "@/types/workspace"
import Link from "next/link"
import { WorkspaceCreateModal } from "@/components/workspace/WorkspaceCreateModal"
// 공간 목록 페이지
export default function WorkspaceListPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isWorkspaceCreateModalOpen, setIsWorkspaceCreateModalOpen] =
    useState(false)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaces = await getWorkspaces()
      setWorkspaces(workspaces)
    }

    fetchWorkspaces()
  }, [])

  const handleWorkspaceCreated = (workspace: Workspace) => {
    setWorkspaces([...workspaces, workspace])
    setIsWorkspaceCreateModalOpen(false)
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          공간 목록 : {workspaces.length}개
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setIsWorkspaceCreateModalOpen(true)}
        >
          공간 생성
        </button>
      </div>
      <WorkspaceCreateModal
        isOpen={isWorkspaceCreateModalOpen}
        onRequestClose={() => setIsWorkspaceCreateModalOpen(false)}
        onWorkspaceCreated={handleWorkspaceCreated}
      />
      {workspaces.map((workspace) => (
        <div
          key={workspace.slug}
          className="border p-4 rounded-md hover:bg-gray-50 transition    "
        >
          <Link href={`/workspace/${workspace.slug}`}>
            <div className="text-lg font-bold">{workspace.name}</div>
            <div className="text-sm text-gray-500">{workspace.description}</div>
          </Link>
        </div>
      ))}
      {workspaces.length === 0 && (
        <div className="text-center text-gray-500">생성한 공간이 없습니다.</div>
      )}
    </div>
  )
}
