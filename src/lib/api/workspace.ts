// 공간 생성 API
export async function createWorkspace(data: {
  name: string
  slug: string
  description?: string
}) {
  // 공간 생성 API 호출
  const res = await fetch("/api/workspaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  // 공간 생성 응답 처리
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "공간 생성 실패")
  return json.workspace // 생성된 공간 반환
}

// 공간 목록 조회 API
export async function getWorkspaces() {
  // 공간 목록 조회 API 호출
  const res = await fetch("/api/workspaces")

  // 공간 목록 조회 응답 처리
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "공간 목록 불러오기 실패")
  return json.workspaces // 공간 목록 반환
}

// 워크스페이스 사용자 역할 조회 API
export async function getUserWorkspaceRole(workspaceSlug: string) {
  const res = await fetch(`/api/workspaces/role?workspaceSlug=${workspaceSlug}`)

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "역할 정보 불러오기 실패")
  return json.role
}
