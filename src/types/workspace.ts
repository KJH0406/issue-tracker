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

// 유저 조회 타입
export interface UserWithStatus {
  id: string
  username: string
  email: string
  isMember: boolean // 워크스페이스에 이미 속해있는지 여부
  role?: string // 초대할 역할
}
