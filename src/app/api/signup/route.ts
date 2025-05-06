import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

// 회원가입 요청
export async function POST(request: Request) {
  // 요청에서 이메일, 유저명, 비밀번호 추출
  const { email, username, password } = await request.json()

  // 모든 필드가 입력되었는지 확인
  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "모든 로그인 정보를 입력해주세요." },
      { status: 400 }
    )
  }

  // 이미 존재하는 유저인지 확인
  const existingUser = await prisma.user.findUnique({ where: { email } })

  // 이미 존재하는 유저인 경우 오류 반환
  if (existingUser) {
    return NextResponse.json(
      { error: "이미 존재하는 이메일입니다." },
      { status: 400 }
    )
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10)

  // 유저 생성
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  })

  return NextResponse.json({ message: "회원가입 성공", user })
}
