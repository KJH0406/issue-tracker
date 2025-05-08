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
