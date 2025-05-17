import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { IssueStatus } from "@prisma/client"

// 이슈 상태 업데이트
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser()

  const { id } = await context.params

  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않았습니다." },
      { status: 401 }
    )
  }

  const { status } = await req.json()

  if (!Object.values(IssueStatus).includes(status as IssueStatus)) {
    return NextResponse.json(
      { message: "잘못된 상태 값입니다." },
      { status: 400 }
    )
  }

  // 이슈 조회
  const issue = await prisma.issue.findUnique({
    where: { id },
    include: {
      project: {
        include: { workspace: true },
      },
    },
  })

  if (!issue) {
    return NextResponse.json(
      { message: "이슈를 찾을 수 없습니다." },
      { status: 404 }
    )
  }

  const isMember = await prisma.workspaceUser.findFirst({
    where: {
      userId: user.userId,
      workspaceId: issue.project.workspace.id,
    },
  })

  if (!isMember) {
    return NextResponse.json(
      { message: "워크스페이스 접근 권한이 없습니다." },
      { status: 403 }
    )
  }

  const updated = await prisma.issue.update({
    where: { id },
    data: { status },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  })

  return NextResponse.json({ issue: updated })
}
