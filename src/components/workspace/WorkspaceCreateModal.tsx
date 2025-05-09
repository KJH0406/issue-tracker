import React, { useState } from "react"
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { createWorkspace } from "@/lib/api/workspace"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Workspace } from "@/types/workspace"

// 공간 생성 모달
export function WorkspaceCreateModal({
  isOpen,
  onRequestClose,
  onWorkspaceCreated,
}: {
  isOpen: boolean
  onRequestClose: () => void
  onWorkspaceCreated: (workspace: Workspace) => void
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const newWorkspace = await createWorkspace({
        name,
        slug,
        description,
      })

      // 공간 생성 성공
      toast.success("공간 생성에 성공했습니다.")

      // 부모 컴포넌트에 새 공간 정보 전달
      onWorkspaceCreated(newWorkspace)

      // 공간로 이동
      router.push(`/workspace/${newWorkspace.slug}`)

      // 모달 닫기
      onRequestClose()
    } catch (error) {
      console.error("공간 생성에 실패했습니다.", error)
      toast.error("공간 생성에 실패했습니다.")
      setError("공간 생성에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <DialogTitle className="text-xl font-semibold mb-4">
          공간 생성
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              placeholder="공간 이름을 입력해주세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              식별자
            </label>
            <input
              type="text"
              placeholder="공간 식별자를 입력해주세요."
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              설명
            </label>
            <textarea
              placeholder="공간 설명을 입력해주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                취소
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isLoading ? "생성 중..." : "생성"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
