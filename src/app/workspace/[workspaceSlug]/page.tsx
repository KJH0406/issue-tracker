"use client"

import { useParams } from "next/navigation"

// 공간 홈 페이지
export default function WorkspaceHomePage() {
  const { workspaceSlug } = useParams()

  return (
    <div>
      이곳은 공간 홈입니다. (프로젝트 전체 이슈 등 표시 예정) : {workspaceSlug}
    </div>
  )
}
