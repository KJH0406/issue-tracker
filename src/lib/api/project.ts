// 프로젝트 생성 API
export async function createProject(data: {
  name: string
  slug: string
  description?: string
  workspaceSlug: string
}) {
  // 프로젝트 생성 API 호출
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  // 프로젝트 생성 응답 처리
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "프로젝트 생성 실패")
  return json.project // 생성된 프로젝트 반환
}

// 프로젝트 목록 조회 API
export async function getProjects(workspaceSlug: string) {
  // 프로젝트 목록 조회 API 호출
  const res = await fetch(`/api/projects?workspaceSlug=${workspaceSlug}`)

  // 프로젝트 목록 조회 응답 처리
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "프로젝트 목록 불러오기 실패")
  return json.projects // 프로젝트 목록 반환
}
