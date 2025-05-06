"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusIcon, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CreateWorkspaceForm from "./create-workspace-form"
import { Workspace } from "@/type"
import { Spinner } from "@/components/ui/spinner"

// 색상 클래스 매핑
const COLOR_CLASSES = {
  indigo: "bg-indigo-100 text-indigo-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  purple: "bg-purple-100 text-purple-600",
  teal: "bg-teal-100 text-teal-600",
  cyan: "bg-cyan-100 text-cyan-600",
  pink: "bg-pink-100 text-pink-600",
  orange: "bg-orange-100 text-orange-600",
}

// 기본 색상
const DEFAULT_COLOR = "indigo"

// 최대 표시할 워크스페이스 수
const MAX_VISIBLE_WORKSPACES = 7

// 워크스페이스 썸네일 컴포넌트
function WorkspaceThumbnail({
  name,
  color = DEFAULT_COLOR,
}: {
  name: string
  color?: string
}) {
  // 색상 클래스 가져오기 (없으면 기본값 사용)
  const colorClass =
    COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] ||
    COLOR_CLASSES[DEFAULT_COLOR]

  // 이름의 첫 두 글자 (또는 한 글자)
  const initials = name.substring(0, 2).toUpperCase()

  return (
    <div
      className={`w-8 h-8 rounded-md flex items-center justify-center font-bold ${colorClass}`}
    >
      {initials}
    </div>
  )
}

// 워크스페이스 셀렉터
export default function WorkspaceSelector() {
  const router = useRouter()
  const params = useParams()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [open, setOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchWorkspaces = async () => {
    setLoading(true)
    const res = await fetch("/api/workspace/my")
    const json = (await res.json()) as { workspaces: Workspace[] }
    setWorkspaces(json.workspaces || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const currentId = params.id ?? ""
  const currentWorkspace =
    workspaces.find((ws) => ws.identifier === currentId) || workspaces[0]

  // 워크스페이스 목록이 MAX_VISIBLE_WORKSPACES보다 많은지 확인
  const needsScroll = workspaces.length > MAX_VISIBLE_WORKSPACES

  return (
    <div className="flex items-center">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 font-medium text-gray-800 hover:bg-gray-100 px-3"
          >
            {loading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <>
                {currentWorkspace && (
                  <WorkspaceThumbnail
                    name={currentWorkspace.name}
                    color={currentWorkspace.color || DEFAULT_COLOR}
                  />
                )}
                <span className="max-w-[150px] truncate">
                  {currentWorkspace?.name || "워크스페이스 선택"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div
            className={`py-1 max-h-[280px] overflow-scroll custom-scrollbar ${
              needsScroll ? "" : ""
            }`}
          >
            {workspaces.map((ws) => (
              <button
                key={ws.identifier}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 ${
                  ws.identifier === currentId
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  router.push(`/workspace/${ws.identifier}`)
                  setPopoverOpen(false)
                }}
              >
                <WorkspaceThumbnail
                  name={ws.name}
                  color={ws.color || DEFAULT_COLOR}
                />
                <span className="truncate">{ws.name}</span>
              </button>
            ))}
          </div>
          <div className="border-t py-1">
            <button
              className="w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                setOpen(true)
                setPopoverOpen(false)
              }}
            >
              <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center">
                <PlusIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <span>새 워크스페이스 생성</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 워크스페이스 생성 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>워크스페이스 생성</DialogTitle>
          <CreateWorkspaceForm setOpen={setOpen} onSuccess={fetchWorkspaces} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
