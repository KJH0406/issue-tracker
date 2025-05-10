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
