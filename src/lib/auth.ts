import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// 인증된 유저 조회
export async function getAuthUser() {
  const cookieStore = await cookies()
  // 토큰 가져오기
  const token = cookieStore.get("token")?.value

  // 토큰이 없으면 null 반환
  if (!token) return null

  // 토큰 검증
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded as { userId: string; role: string }
  } catch {
    return null
  }
}
