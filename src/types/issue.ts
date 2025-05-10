// 이슈 타입
export type Issue = {
  id: string
  title: string
  description?: string | null
  createdAt: string
  projectId: string
  authorId: string
}
