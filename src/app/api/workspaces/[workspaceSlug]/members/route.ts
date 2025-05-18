import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WorkspaceRole } from "@prisma/client"

// 워크스페이스 멤버 초대
export async function POST(
  req: NextRequest,
  context: { params: { workspaceSlug: string } }
) {
  const { workspaceSlug } = await context.params

  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 }
    )
  }

  // 단일 사용자 또는 여러 사용자 초대 처리
  const body = await req.json()

  // 여러 사용자 초대 형식 확인
  if (Array.isArray(body)) {
    // 여러 사용자 초대 처리
    if (body.length === 0) {
      return NextResponse.json(
        { message: "초대할 사용자가 없습니다." },
        { status: 400 }
      )
    }

    // 워크스페이스 존재 여부 확인
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json(
        { message: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const results = []
    const errors = []

    // 각 사용자 초대 처리
    for (const { email, role } of body) {
      if (!email || !role || !Object.values(WorkspaceRole).includes(role)) {
        errors.push({ email, message: "유효하지 않은 이메일 또는 역할입니다." })
        continue
      }

      try {
        // 초대할 사용자 찾기
        const targetUser = await prisma.user.findUnique({
          where: { email },
        })

        if (!targetUser) {
          errors.push({ email, message: "사용자를 찾을 수 없습니다." })
          continue
        }

        // 이미 멤버인지 확인
        const already = await prisma.workspaceUser.findUnique({
          where: {
            userId_workspaceId: {
              userId: targetUser.id,
              workspaceId: workspace.id,
            },
          },
        })

        if (already) {
          errors.push({ email, message: "이미 워크스페이스 멤버입니다." })
          continue
        }

        // 초대 처리
        const invited = await prisma.workspaceUser.create({
          data: {
            userId: targetUser.id,
            workspaceId: workspace.id,
            role,
          },
        })

        results.push(invited)
      } catch (error) {
        errors.push({ email, message: "초대 처리 중 오류가 발생했습니다." })
      }
    }

    return NextResponse.json({ results, errors }, { status: 207 })
  } else {
    // 단일 사용자 초대 처리 (기존 코드)
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { message: "이메일과 역할이 필요합니다." },
        { status: 400 }
      )
    }

    if (!Object.values(WorkspaceRole).includes(role)) {
      return NextResponse.json(
        { message: "유효하지 않은 역할입니다." },
        { status: 400 }
      )
    }

    try {
      // 워크스페이스 존재 여부 확인
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

      // 초대할 사용자 찾기
      const targetUser = await prisma.user.findUnique({
        where: { email },
      })

      if (!targetUser) {
        return NextResponse.json(
          { message: "사용자를 찾을 수 없습니다." },
          { status: 404 }
        )
      }

      // 이미 멤버인지 확인
      const already = await prisma.workspaceUser.findUnique({
        where: {
          userId_workspaceId: {
            userId: targetUser.id,
            workspaceId: workspace.id,
          },
        },
      })

      if (already) {
        return NextResponse.json(
          { message: "이미 워크스페이스 멤버입니다." },
          { status: 409 }
        )
      }

      // 초대 처리
      const invited = await prisma.workspaceUser.create({
        data: {
          userId: targetUser.id,
          workspaceId: workspace.id,
          role,
        },
      })

      return NextResponse.json(invited, { status: 201 })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { message: "서버 오류가 발생했습니다." },
        { status: 500 }
      )
    }
  }
}

// 워크스페이스 멤버 목록 조회
export async function GET(
  req: NextRequest,
  context: { params: { workspaceSlug: string } }
) {
  const { workspaceSlug } = await context.params

  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 }
    )
  }

  try {
    // 워크스페이스 존재 여부 확인
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

    // 워크스페이스 멤버 목록 조회
    const members = await prisma.workspaceUser.findMany({
      where: { workspaceId: workspace.id },
      include: {
        user: { select: { username: true, email: true } },
      },
    })

    return NextResponse.json(members, { status: 200 })
  } catch (error) {
    console.error("[GET /workspaces/:id/members]", error)
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
