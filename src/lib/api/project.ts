// 프로젝트 생성 API
export async function createProject(data: {
  name: string
  description?: string
  workspaceId: string
}) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "프로젝트 생성 실패")
  return json.project
}

// 프로젝트 목록 조회 API
export async function getProjects(workspaceId: string) {
  const res = await fetch(`/api/projects?workspaceId=${workspaceId}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "프로젝트 목록 불러오기 실패")
  return json.projects
}
