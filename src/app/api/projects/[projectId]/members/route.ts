import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProjectRole } from "@/types/project"

// 프로젝트 멤버 초대
export async function POST(
  req: NextRequest,
  context: { params: { projectId: string } }
) {
  const { projectId } = await context.params

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

  // 역할 유효성 검사
  if (!Object.values(ProjectRole).includes(role)) {
    return NextResponse.json(
      { message: "유효하지 않은 역할입니다." },
      { status: 400 }
    )
  }

  try {
    // 프로젝트 존재 여부 확인
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: { include: { users: true } } },
    })

    if (!project) {
      return NextResponse.json(
        { message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 워크스페이스 멤버인지 확인
    const targetUser = await prisma.user.findUnique({
      where: { email },
      include: {
        workspaces: {
          where: { workspaceId: project.workspaceId },
        },
      },
    })

    if (!targetUser || targetUser.workspaces.length === 0) {
      return NextResponse.json(
        { message: "워크스페이스 멤버가 아닙니다." },
        { status: 403 }
      )
    }

    // 이미 프로젝트 멤버인지 확인
    const existing = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: targetUser.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { message: "이미 프로젝트 멤버입니다." },
        { status: 409 }
      )
    }

    // 초대 등록
    const added = await prisma.projectUser.create({
      data: {
        projectId: project.id,
        userId: targetUser.id,
        role,
      },
    })

    return NextResponse.json(added, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
