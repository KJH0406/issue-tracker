import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    })

    if (!comment) {
      return NextResponse.json(
        { message: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (comment.authorId !== user.userId) {
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
