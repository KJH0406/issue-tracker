// 이슈 댓글 목록 조회
export async function getComments(issueId: string) {
  const res = await fetch(`/api/comments?issueId=${issueId}`)
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.message || "댓글 조회 실패")
  }
  return res.json()
}

// 이슈 댓글 작성
export async function createComment(issueId: string, content: string) {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issueId, content }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.message || "댓글 작성 실패")
  }
  return res.json()
}

// 댓글 삭제
export async function deleteComment(commentId: string) {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.message || "댓글 삭제 실패")
  }
  return res.json()
}
