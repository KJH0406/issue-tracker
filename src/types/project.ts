// 프로젝트 타입
export type Project = {
  id: string
  name: string
  slug: string
  description: string | null
}

// 프로젝트 역할
export enum ProjectRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}
