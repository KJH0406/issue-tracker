import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 공간 생성
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    // 공간 정보
    const { name, slug, description } = await req.json()

    // 공간 검증
    if (!name || !slug) {
      return NextResponse.json(
        { message: "공간 이름과 식별자는 필수입니다." },
        { status: 400 }
      )
    }

    // 공간 식별자 유효성 검증
    if (!/^[a-z0-9]+$/.test(slug)) {
      return NextResponse.json(
        { message: "공간 식별자는 소문자, 숫자만 포함 가능합니다." },
        { status: 400 }
      )
    }

    // 공간 식별자 중복 검증
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug },
    })
    if (existingWorkspace) {
      return NextResponse.json(
        { message: "이미 존재하는 공간 식별자입니다." },
        { status: 400 }
      )
    }

    // 공간 생성
    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        description,
        users: {
          create: {
            userId: user.userId,
            role: "ADMIN", // 자동으로 관리자 역할 부여
          },
        },
      },
    })

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    console.error("공간 생성 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}

// 공간 목록 조회
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 유저가 속한 모든 공간 조회
    const workspaces = await prisma.workspaceUser.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        workspace: true, // 공간 기본 정보 포함
      },
    })

    // role 정보와 함께 workspace만 추출해서 반환
    const result = workspaces.map((entry) => ({
      id: entry.workspace.id,
      name: entry.workspace.name,
      slug: entry.workspace.slug,
      description: entry.workspace.description,
      createdAt: entry.workspace.createdAt,
      role: entry.role,
    }))
    return NextResponse.json({ workspaces: result }, { status: 200 })
  } catch (error) {
    console.error("공간 목록 조회 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
