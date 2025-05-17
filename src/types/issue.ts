// 이슈 타입
export type Issue = {
  id: string
  number: number
  title: string
  description?: string | null
  createdAt: string
  projectId: string
  authorId: string
  author: {
    username: string
  }
  status: string
}
