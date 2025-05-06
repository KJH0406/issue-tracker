import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { NextResponse } from "next/server"

// 내가 속한 워크스페이스 목록 조회
export async function GET() {
  const user = await getAuthUser()
  // 인증되지 않은 경우
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 내가 속한 워크스페이스 목록 조회
  const myWorkspaces = await prisma.member.findMany({
    where: { userId: user.userId },
    include: {
      workspace: true,
    },
  })

  // 워크스페이스 목록 조회
  const workspaces = myWorkspaces.map((data) => ({
    id: data.workspace.id,
    name: data.workspace.name,
    inviteCode: data.workspace.inviteCode,
    identifier: data.workspace.identifier,
    imageUrl: data.workspace.imageUrl,
    role: data.role,
    color: data.workspace.color,
  }))
  return NextResponse.json({ workspaces })
}
