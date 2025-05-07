"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import CreateProjectForm from "./create-project-form"

export default function CreateProjectModal({
  workspaceId,
  workspaceIdentifier,
}: {
  workspaceId: string
  workspaceIdentifier: string
}) {
  return (
    <Dialog>
      {/* Trigger: 버튼을 누르면 모달이 열린다 */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 group transition-colors"
        >
          <Plus className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
          <span className="hidden md:inline font-medium">프로젝트 추가</span>
        </Button>
      </DialogTrigger>

      {/* 모달 콘텐츠 */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 프로젝트 생성</DialogTitle>
          {/* 닫기 버튼 */}
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>

        {/* 실제 폼 컴포넌트 */}
        <CreateProjectForm
          workspaceId={workspaceId}
          workspaceIdentifier={workspaceIdentifier}
        />
      </DialogContent>
    </Dialog>
  )
}
