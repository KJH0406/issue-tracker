"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Workspace } from "@/types/workspace"
import { WorkspaceCreateModal } from "@/components/workspace/WorkspaceCreateModal"
import { getWorkspaces } from "@/lib/api/workspace"

// 공간 목록 페이지
export default function WorkspaceListPage() {
  // 공간 목록
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  // 공간 생성 모달 상태
  const [isWorkspaceCreateModalOpen, setIsWorkspaceCreateModalOpen] =
    useState(false)

  // 공간 목록 조회
  useEffect(() => {
    // 공간 목록 조회 API
    const fetchWorkspaces = async () => {
      const workspaces = await getWorkspaces()
      // 공간 목록 상태 업데이트
      setWorkspaces(workspaces)
    }

    // 페이지 로드 시 공간 목록 조회 실행
    fetchWorkspaces()
  }, [])

  // 공간 생성 완료 시 실행
  const handleWorkspaceCreated = (workspace: Workspace) => {
    // 공간 목록 상태 업데이트(기존 공간 목록에 생성된 공간 추가)
    setWorkspaces([...workspaces, workspace])
    // 공간 생성 모달 닫기
    setIsWorkspaceCreateModalOpen(false)
  }

  return (
    <div className="space-y-4 p-6">
      {/* 공간 목록 헤더 영역 */}
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

      {/* 공간 생성 모달 */}
      <WorkspaceCreateModal
        isOpen={isWorkspaceCreateModalOpen}
        onRequestClose={() => setIsWorkspaceCreateModalOpen(false)}
        onWorkspaceCreated={handleWorkspaceCreated}
      />

      {/* 공간 목록 */}
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

      {/* 공간이 없는 경우 */}
      {workspaces.length === 0 && (
        <div className="text-center text-gray-500">생성한 공간이 없습니다.</div>
      )}
    </div>
  )
}
