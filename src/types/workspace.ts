// 워크스페이스 타입
export type Workspace = {
  id: string
  name: string
  description: string | null
  role: "ADMIN" | "MEMBER"
  createdAt: string
}

// 워크스페이스 역할 타입
export type WorkspaceRole = "ADMIN" | "MEMBER"

// 워크스페이스 스토어 타입(zustand)
export type WorkspaceStore = {
  // 현재 워크스페이스
  current: Workspace | null
  // 워크스페이스 설정
  setWorkspace: (workspace: Workspace) => void
  // 워크스페이스 초기화
  clearWorkspace: () => void
}
