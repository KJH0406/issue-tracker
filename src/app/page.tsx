import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  // 인증된 사용자 조회
  const user = await getAuthUser()

  // 인증된 사용자가 아니면 로그인 페이지로 리다이렉트
  if (!user) redirect("/login")

  return (
    <main className="p-8">
      <h1>안녕하세요! 인증된 사용자입니다.</h1>
    </main>
  )
}
