import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 이슈 댓글 생성
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { issueId, content } = await request.json()

    if (!issueId || !content) {
      return NextResponse.json(
        { message: "issueId and content are required" },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        issueId,
        content,
        authorId: user.userId,
      },
      include: {
        author: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 }
    )
  }
}

// 이슈 댓글 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const issueId = searchParams.get("issueId")

    if (!issueId) {
      return NextResponse.json(
        { message: "issueId is required" },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: { issueId },
      include: {
        author: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
