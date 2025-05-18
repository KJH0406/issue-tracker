"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import WorkspaceMemberList from "@/components/workspace/WorkspaceMemberList"
import WorkspaceInviteModal from "@/components/workspace/WorkspaceInviteModal"

export default function AdminPage() {
  const params = useParams()
  const workspaceSlug = params.workspaceSlug as string

  const [open, setOpen] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">워크스페이스 관리자 페이지</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">워크스페이스 멤버</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + 사용자 초대
        </button>
      </div>

      <WorkspaceMemberList
        workspaceSlug={workspaceSlug}
        refreshKey={refreshKey}
      />

      <WorkspaceInviteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        workspaceSlug={workspaceSlug}
        onInviteSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </main>
  )
}
