import { Issue } from "@/types/issue"

// 이슈 생성
export async function createIssue(data: {
  title: string
  description?: string | null
  projectId: string
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

  // 이슈 생성 API 호출 실패 시 오류 발생
  if (!res.ok) {
    throw new Error(json.message || "이슈 생성에 실패했습니다.")
  }

  // 이슈 생성 성공 시 이슈 데이터 반환
  return json.issue
}
