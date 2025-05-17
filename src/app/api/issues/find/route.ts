import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 단일 이슈 조회
export async function GET(req: NextRequest) {
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않았습니다." },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const workspaceSlug = searchParams.get("workspaceSlug")
  const projectSlug = searchParams.get("projectSlug")
  const number = searchParams.get("number")

  if (!workspaceSlug || !projectSlug || !number) {
    return NextResponse.json(
      { message: "쿼리 누락: workspaceSlug, projectSlug, number 필요" },
      { status: 400 }
    )
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
  })

  if (!workspace) {
    return NextResponse.json({ message: "워크스페이스 없음" }, { status: 404 })
  }

  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      workspaceId: workspace.id,
    },
  })

  if (!project) {
    return NextResponse.json({ message: "프로젝트 없음" }, { status: 404 })
  }

  const issue = await prisma.issue.findFirst({
    where: {
      projectId: project.id,
      number: Number(number),
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  })

  if (!issue) {
    return NextResponse.json({ message: "이슈 없음" }, { status: 404 })
  }

  return NextResponse.json({ issue })
}
