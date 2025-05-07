import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 워크스페이스 생성
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    // 워크스페이스 이름 및 설명
    const { name, description } = await req.json()

    // 워크스페이스 이름 필수 검증
    if (!name) {
      return NextResponse.json(
        { message: "워크스페이스 이름은 필수입니다." },
        { status: 400 }
      )
    }

    // 워크스페이스 생성
    const workspace = await prisma.workspace.create({
      data: {
        name,
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
    console.error("워크스페이스 생성 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}

// 워크스페이스 목록 조회
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 유저가 속한 모든 워크스페이스 조회
    const workspaces = await prisma.workspaceUser.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        workspace: true, // 워크스페이스 기본 정보 포함
      },
    })

    // role 정보와 함께 workspace만 추출해서 반환
    const result = workspaces.map((entry) => ({
      id: entry.workspace.id,
      name: entry.workspace.name,
      description: entry.workspace.description,
      createdAt: entry.workspace.createdAt,
      role: entry.role,
    }))

    return NextResponse.json({ workspaces: result }, { status: 200 })
  } catch (error) {
    console.error("워크스페이스 목록 조회 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
