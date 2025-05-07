import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 사용자 정보 조회
export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { message: "인증되지 않은 사용자" },
        { status: 401 }
      )
    }

    // 사용자 정보 조회
    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { username: true, email: true },
    })

    if (!userInfo) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json(userInfo)
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
