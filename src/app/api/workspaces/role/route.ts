import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 워크스페이스 사용자 역할 조회 API
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workspaceSlug = searchParams.get("workspaceSlug")

    if (!workspaceSlug) {
      return NextResponse.json(
        { message: "워크스페이스 식별자가 필요합니다." },
        { status: 400 }
      )
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json(
        { message: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspaceId: workspace.id,
      },
    })

    if (!workspaceUser) {
      return NextResponse.json(
        { message: "워크스페이스 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    return NextResponse.json({ role: workspaceUser.role })
  } catch (error) {
    console.error("역할 조회 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
