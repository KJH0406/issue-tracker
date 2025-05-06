import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { generateInviteCode } from "@/lib/generate-invite-code"
import { NextResponse } from "next/server"

// 워크스페이스 생성
export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, identifier, color } = await req.json()

  if (!name || !identifier) {
    return NextResponse.json(
      { error: "이름과 식별자를 모두 입력해주세요." },
      { status: 400 }
    )
  }

  // 식별자 중복 확인
  const exists = await prisma.workspace.findUnique({
    where: { identifier },
  })

  // 식별자 중복 시 오류 반환
  if (exists) {
    return NextResponse.json(
      { error: "이미 사용 중인 식별자입니다." },
      { status: 409 }
    )
  }

  // 초대 코드 생성
  const inviteCode = generateInviteCode()

  // 워크스페이스 생성
  const workspace = await prisma.workspace.create({
    data: {
      name,
      identifier,
      color,
      inviteCode,
      userId: user.userId,
      members: {
        create: {
          userId: user.userId,
          role: "admin", // 워크스페이스 생성자는 관리자 권한 부여
        },
      },
    },
  })

  return NextResponse.json({ workspace })
}
