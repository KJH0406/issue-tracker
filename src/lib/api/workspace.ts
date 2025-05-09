// 공간 생성 API
export async function createWorkspace(data: {
  name: string
  slug: string
  description?: string
}) {
  const res = await fetch("/api/workspaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "공간 생성 실패")
  return json.workspace
}

// 공간 목록 조회 API
export async function getWorkspaces() {
  const res = await fetch("/api/workspaces")
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "공간 목록 불러오기 실패")
  return json.workspaces
}
