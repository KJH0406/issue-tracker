import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// 로그인 요청
export async function POST(request: Request) {
  // 요청에서 이메일, 비밀번호 추출
  const { email, password } = await request.json()

  // 이메일에 해당하는 유저 조회
  const user = await prisma.user.findUnique({ where: { email } })

  // 유저가 존재하지 않는 경우 오류 반환
  if (!user)
    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다." },
      { status: 401 }
    )

  // 비밀번호 비교
  const isMatch = await bcrypt.compare(password, user.password)

  // 비밀번호가 틀린 경우 오류 반환
  if (!isMatch)
    return NextResponse.json(
      { error: "비밀번호가 틀렸습니다." },
      { status: 401 }
    )

  // 토큰 생성
  const token = jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d", // 7일 후 만료
    }
  )

  // 토큰 쿠키 설정
  const cookieStore = await cookies()
  cookieStore.set("token", token, { httpOnly: true })

  return NextResponse.json({ message: "로그인 성공" })
}
