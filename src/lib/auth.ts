import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// 인증된 유저 조회
export async function getAuthUser() {
  const cookieStore = await cookies()
  // 토큰 가져오기
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded as {
      userId: string
      username: string
      email: string
    }
  } catch {
    return null
  }
}
