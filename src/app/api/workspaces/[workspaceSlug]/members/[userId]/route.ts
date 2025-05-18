import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WorkspaceRole } from "@prisma/client"

// 워크스페이스 멤버 역할 변경
export async function PATCH(
  req: NextRequest,
  context: { params: { workspaceSlug: string; userId: string } }
) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceSlug, userId } = await context.params
    const { role } = await req.json()

    if (!Object.values(WorkspaceRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
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

    const updated = await prisma.workspaceUser.updateMany({
      where: {
        workspaceId: workspace.id,
        userId: userId,
      },
      data: {
        role: role,
      },
    })

    if (updated.count === 0) {
      return NextResponse.json(
        { message: "해당 사용자는 워크스페이스에 속해 있지 않습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "역할이 성공적으로 변경되었습니다." })
  } catch (error) {
    console.error("Error updating workspace member:", error)
    return NextResponse.json(
      { error: "Failed to update workspace member" },
      { status: 500 }
    )
  }
}

// 워크스페이스 멤버 삭제
export async function DELETE(
  req: NextRequest,
  context: { params: { workspaceSlug: string; userId: string } }
) {
  const authUser = await getAuthUser()

  if (!authUser) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 }
    )
  }

  const { workspaceSlug, userId } = await context.params

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json(
        { message: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const deleted = await prisma.workspaceUser.deleteMany({
      where: {
        workspaceId: workspace.id,
        userId,
      },
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "해당 사용자는 워크스페이스에 속해 있지 않습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "사용자가 워크스페이스에서 제거되었습니다.",
    })
  } catch (err) {
    console.error("멤버 제거 오류:", err)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
