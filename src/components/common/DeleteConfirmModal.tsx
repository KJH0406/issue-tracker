"use client"

import { useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title?: string
  description?: string
  resourceType?: string
  resourceName?: string
  isDeleting?: boolean
  titlePrefix?: string
  descriptionContent?: React.ReactNode
  additionalContent?: React.ReactNode
}

// 사용법 예시
{
  /* <DeleteConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleDelete}
  titlePrefix="댓글"
  resourceName="123"
  descriptionContent={
    <>
      <span className="font-medium">댓글 ID: 123, 내용: 안녕하세요</span>을 삭제하시겠습니까?
      <br />이 작업은 되돌릴 수 없습니다.
    </>
  }
  additionalContent={
    <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
      이 댓글을 삭제하면 관련된 모든 답글도 함께 삭제됩니다.
    </div>
  }
/> */
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  resourceType,
  resourceName,
  isDeleting = false,
  titlePrefix,
  descriptionContent,
  additionalContent,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("삭제 중 오류 발생:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !loading && onClose()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>
              {titlePrefix && resourceName
                ? `${titlePrefix} ${resourceName} 삭제`
                : title}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {descriptionContent ? (
              descriptionContent
            ) : resourceName ? (
              <>
                <span className="font-medium">{resourceName}</span>{" "}
                {resourceType}을(를) 삭제하시겠습니까?
                <br />이 작업은 되돌릴 수 없습니다.
              </>
            ) : (
              description
            )}
          </DialogDescription>
          {additionalContent && <div className="mt-2">{additionalContent}</div>}
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 sm:flex-initial"
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 sm:flex-initial"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>삭제 중...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>삭제</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
