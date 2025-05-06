// 초대 코드로 참가
export async function joinWorkspace(code: string) {
  const res = await fetch("/api/workspace/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })

  const data = await res.json()

  if (!res.ok) {
    // throw로 에러를 던지면 컴포넌트 입장에선 catch 만 처리하면 됩니다.
    throw new Error(data.error || "초대 코드가 유효하지 않습니다.")
  }

  return data
}
