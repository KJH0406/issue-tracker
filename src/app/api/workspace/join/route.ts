import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { NextResponse } from "next/server"

// 초대 코드로 참가
export async function POST(req: Request) {
  // 인증 유저 조회
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 초대 코드 추출
  const { code } = await req.json()

  // 초대 코드가 없는 경우 오류 반환
  if (!code) {
    return NextResponse.json(
      { error: "초대 코드를 입력해주세요" },
      { status: 400 }
    )
  }

  // 초대 코드로 워크스페이스 조회
  const workspace = await prisma.workspace.findUnique({
    where: { inviteCode: code },
  })

  // 초대 코드로 워크스페이스를 찾을 수 없는 경우 오류 반환
  if (!workspace) {
    return NextResponse.json(
      { error: "초대 코드를 찾을 수 없습니다." },
      { status: 404 }
    )
  }

  // 이미 가입된 워크스페이스인지 확인
  const existing = await prisma.member.findFirst({
    where: {
      userId: user.userId,
      workspaceId: workspace.id,
    },
  })

  // 이미 가입된 워크스페이스인 경우 오류 반환
  if (existing) {
    return NextResponse.json({
      message: "이미 가입된 워크스페이스입니다.",
      workspace,
    })
  }

  // 워크스페이스 참가
  await prisma.member.create({
    data: {
      userId: user.userId,
      workspaceId: workspace.id,
      role: "member", // 기본 권한
    },
  })

  // 워크스페이스 참가 성공 반환
  return NextResponse.json({
    status: "success",
    message: "워크스페이스에 참가되었습니다",
    workspace,
  })
}
