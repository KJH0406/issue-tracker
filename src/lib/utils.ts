import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 이슈 상태 스타일 반환 (레이블과 색상 매핑)
export function getStatusStyle(status: string) {
  switch (status) {
    case "TODO":
      return { label: "할 일", color: "bg-gray-200 text-gray-800" }
    case "IN_PROGRESS":
      return { label: "진행 중", color: "bg-blue-200 text-blue-800" }
    case "DONE":
      return { label: "완료됨", color: "bg-green-200 text-green-800" }
    case "CANCELLED":
      return { label: "취소됨", color: "bg-red-200 text-red-800" }
    default:
      return { label: "알 수 없음", color: "bg-gray-100 text-gray-400" }
  }
}
