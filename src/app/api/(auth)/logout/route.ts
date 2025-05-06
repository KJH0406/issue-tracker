import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 로그아웃 요청
export async function POST(request: Request) {
  const cookieStore = await cookies()

  // 토큰 쿠키 삭제
  cookieStore.delete("token")

  // 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL("/login", request.url))
}
