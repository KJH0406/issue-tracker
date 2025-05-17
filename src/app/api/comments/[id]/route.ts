import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 댓글 삭제 API
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params
  try {
    const user = await getAuthUser()
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const comment = await prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        issue: {
          select: {
            project: {
              select: {
                workspace: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!comment) {
      return NextResponse.json(
        { message: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 워크스페이스 ID 가져오기
    const workspaceId = comment.issue.project.workspace.id

    // 사용자가 해당 워크스페이스의 관리자인지 확인
    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspaceId: workspaceId,
      },
    })

    // 삭제 권한 확인: 댓글 작성자이거나 워크스페이스 관리자인 경우
    const isAuthor = comment.authorId === user.userId
    const isAdmin = workspaceUser?.role === "ADMIN"

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { message: "삭제 권한이 없습니다." },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id },
    })

    return NextResponse.json({ message: "댓글이 삭제되었습니다." })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "댓글 삭제 실패" }, { status: 500 })
  }
}
