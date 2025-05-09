import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 프로젝트 생성 API
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, slug, description, workspaceSlug } = await req.json()

    if (!name || !slug || !workspaceSlug) {
      return NextResponse.json(
        { message: "이름, 식별자, 공간 식별자는 필수입니다." },
        { status: 400 }
      )
    }

    // 사용자가 해당 공간의 멤버인지 확인
    const isMember = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspace: { slug: workspaceSlug },
      },
    })

    if (!isMember) {
      return NextResponse.json(
        { message: "공간 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 프로젝트 식별자 중복 검증
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    })
    if (existingProject) {
      return NextResponse.json(
        { message: "이미 존재하는 프로젝트 식별자입니다." },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        workspace: { connect: { slug: workspaceSlug } },
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("프로젝트 생성 오류:", error)
    return NextResponse.json({ message: "서버 오류" }, { status: 500 })
  }
}

// 프로젝트 목록 조회 API
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 공간 ID 추출
    const { searchParams } = new URL(req.url)
    const workspaceSlug = searchParams.get("workspaceSlug")

    if (!workspaceSlug) {
      return NextResponse.json(
        { message: "공간 식별자가 필요합니다." },
        { status: 400 }
      )
    }

    // 유저가 이 공간에 속한지 확인
    const isMember = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspace: { slug: workspaceSlug },
      },
    })

    // 유저 접근 권한 확인
    if (!isMember) {
      return NextResponse.json(
        { message: "공간 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 프로젝트 목록 조회
    const projects = await prisma.project.findMany({
      where: { workspace: { slug: workspaceSlug } },
      orderBy: { createdAt: "desc" }, // 최신 순으로 정렬
    })

    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error("프로젝트 목록 조회 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
