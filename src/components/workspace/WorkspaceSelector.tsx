"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Workspace } from "@/types/workspace"
import { getWorkspaces } from "@/lib/api/workspace"
import { WorkspaceCreateModal } from "./WorkspaceCreateModal"

// 공간 셀렉터
export function WorkspaceSelector() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  const currentSlug = params.workspaceSlug as string
  const current = workspaces.find((ws) => ws.slug === currentSlug)

  // 공간 데이터 가져오기
  const fetchWorkspaces = async () => {
    const workspaces = await getWorkspaces()
    setWorkspaces(workspaces)
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  // URL 파라미터 변경 감지
  useEffect(() => {
    if (currentSlug) {
      // URL 변경 시 현재 공간가 목록에 없으면 공간 다시 가져오기
      if (!workspaces.some((ws) => ws.slug === currentSlug)) {
        fetchWorkspaces()
      }
    }
  }, [currentSlug, workspaces])

  const handleSelect = (selectedSlug: string) => {
    const selected = workspaces.find((ws) => ws.slug === selectedSlug)
    if (selected) {
      router.push(`/workspace/${selected.slug}`)
    }
    setIsOpen(false)
  }

  // 새로운 공간 생성 핸들러
  const handleCreateWorkspace = () => {
    setIsCreateModalOpen(true)
  }

  // 새 공간 생성 완료 핸들러
  const handleWorkspaceCreated = (newWorkspace: Workspace) => {
    // 새 공간를 목록에 추가
    setWorkspaces((prev) => [...prev, newWorkspace])
    setIsCreateModalOpen(false)
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".workspace-selector")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="workspace-selector relative inline-block min-w-[200px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span className="flex items-center">
          <span className="w-2 h-2 mr-2 rounded-full bg-blue-500"></span>
          <span className="font-medium">{current?.name || "공간 선택"}</span>
        </span>
        <svg
          className={`w-5 h-5 ml-2 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1 max-h-48 overflow-y-auto">
            {workspaces.map((ws) => (
              <li
                key={ws.slug}
                onClick={() => handleSelect(ws.slug)}
                className={`px-4 py-2 text-sm cursor-pointer flex items-center hover:bg-gray-100 ${
                  ws.slug === currentSlug
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                {ws.name}
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200">
            <button
              onClick={handleCreateWorkspace}
              className="w-full px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              공간 생성하기
            </button>
            <button
              onClick={() => router.push("/workspace")}
              className="w-full px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              공간 목록 보기
            </button>
          </div>
        </div>
      )}
      {isCreateModalOpen && (
        <WorkspaceCreateModal
          isOpen={isCreateModalOpen}
          onRequestClose={() => setIsCreateModalOpen(false)}
          onWorkspaceCreated={handleWorkspaceCreated}
        />
      )}
    </div>
  )
}
