import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WorkspaceRole } from "@prisma/client"

// 워크스페이스 멤버 초대
export async function POST(
  req: NextRequest,
  context: { params: { workspaceId: string } }
) {
  const { workspaceId } = await context.params

  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 }
    )
  }

  const { email, role } = await req.json()

  if (!email || !role) {
    return NextResponse.json(
      { message: "이메일과 역할이 필요합니다." },
      { status: 400 }
    )
  }

  if (!Object.values(WorkspaceRole).includes(role)) {
    return NextResponse.json(
      { message: "유효하지 않은 역할입니다." },
      { status: 400 }
    )
  }

  try {
    // 워크스페이스 존재 여부 확인
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        users: true, // WorkspaceUser[]
      },
    })

    if (!workspace) {
      return NextResponse.json(
        { message: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 초대할 사용자 찾기
    const targetUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!targetUser) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 이미 멤버인지 확인
    const already = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: targetUser.id,
          workspaceId: workspace.id,
        },
      },
    })

    if (already) {
      return NextResponse.json(
        { message: "이미 워크스페이스 멤버입니다." },
        { status: 409 }
      )
    }

    // 초대 처리
    const invited = await prisma.workspaceUser.create({
      data: {
        userId: targetUser.id,
        workspaceId: workspace.id,
        role,
      },
    })

    return NextResponse.json(invited, { status: 201 })
  } catch (error) {
    console.error("[POST /workspaces/:id/members]", error)
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
