"use client"

import { useEffect, useState, useRef } from "react"
import { useWorkspaceStore } from "@/stores/workspace"
import { Workspace } from "@/types/workspace"
import { getWorkspaces } from "@/lib/api/workspace"
import { ChevronDown } from "lucide-react"

// 워크스페이스 셀렉터
export function WorkspaceSelector() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { current, setWorkspace } = useWorkspaceStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 워크스페이스 목록 조회
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaces = await getWorkspaces()
      setWorkspaces(workspaces)
    }

    fetchWorkspaces()
  }, [])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 워크스페이스 변경 핸들러
  const handleSelect = (workspace: Workspace) => {
    setWorkspace(workspace)
    setIsOpen(false)
  }

  return (
    <div className="relative w-40" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {current?.name ? (
          <div className="flex items-center gap-3 w-full">
            <span className="font-medium truncate">{current.name}</span>
          </div>
        ) : (
          <span className="text-gray-500">워크스페이스 선택</span>
        )}
        <ChevronDown
          className={`flex-shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleSelect(workspace)}
                  className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                    current?.id === workspace.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span
                      className={`${
                        current?.id === workspace.id ? "font-medium" : ""
                      } truncate`}
                    >
                      {workspace.name}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                워크스페이스가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
