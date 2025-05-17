import { Issue } from "@/types/issue"

// 이슈 생성
export async function createIssue(data: {
  title: string
  description?: string
  workspaceSlug: string
  projectSlug: string
}): Promise<Issue> {
  // 이슈 생성 API 호출
  const res = await fetch("/api/issues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  // 이슈 생성 API 응답 데이터 파싱
  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || "이슈 생성 실패")
  }

  // 이슈 생성 성공 시 이슈 데이터 반환
  return json.issue
}

// 이슈 목록 조회
export async function getIssues(
  workspaceSlug: string,
  projectSlug: string
): Promise<Issue[]> {
  // 이슈 목록 조회 API 호출
  const res = await fetch(
    `/api/issues?workspaceSlug=${workspaceSlug}&projectSlug=${projectSlug}`
  )

  // 이슈 목록 조회 API 응답 데이터 파싱
  const json = await res.json()

  // 이슈 목록 조회 API 호출 실패 시 오류 발생
  if (!res.ok) {
    throw new Error(json.message || "이슈 목록 조회 실패")
  }

  // 이슈 목록 조회 성공 시 이슈 목록 반환
  return json.issues
}

// 이슈 상세 조회
export async function getIssue(
  issueNumber: number,
  workspaceSlug: string,
  projectSlug: string
): Promise<Issue> {
  // 이슈 상세 조회 API 호출
  const res = await fetch(
    `/api/issues/find?workspaceSlug=${workspaceSlug}&projectSlug=${projectSlug}&number=${issueNumber}`
  )

  // 이슈 상세 조회 API 응답 데이터 파싱
  const json = await res.json()

  // 이슈 상세 조회 API 호출 실패 시 오류 발생
  if (!res.ok) {
    throw new Error(json.message || "이슈 상세 조회 실패")
  }

  // 이슈 상세 조회 성공 시 이슈 데이터 반환
  return json.issue
}
