// 공간 타입
export type Workspace = {
  id: string
  slug: string
  name: string
  description: string | null
  role: "ADMIN" | "MEMBER"
  createdAt: string
}

// 공간 역할 타입
export type WorkspaceRole = "ADMIN" | "MEMBER"

// 공간 스토어 타입(zustand)
export type WorkspaceStore = {
  // 현재 공간
  current: Workspace | null
  // 공간 설정
  setWorkspace: (workspace: Workspace) => void
  // 공간 초기화
  clearWorkspace: () => void
}
