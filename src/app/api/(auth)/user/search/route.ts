import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// 사용자 검색
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")
  const workspaceSlug = searchParams.get("workspaceSlug")

  if (!query || !workspaceSlug) {
    return NextResponse.json({ message: "올바르지 않은 쿼리" }, { status: 400 })
  }

  try {
    // 워크스페이스 ID 가져오기
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
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

    const workspaceUserIds = workspace.users.map((wu) => wu.userId)

    // 검색 대상 사용자
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    })

    const result = users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      isMember: workspaceUserIds.includes(user.id),
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "서버 오류" }, { status: 500 })
  }
}
