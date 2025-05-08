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

    const { name, description, workspaceId } = await req.json()

    if (!name || !workspaceId) {
      return NextResponse.json(
        { message: "이름과 워크스페이스 ID는 필수입니다." },
        { status: 400 }
      )
    }

    // 사용자가 해당 워크스페이스의 멤버인지 확인
    const isMember = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspaceId,
      },
    })

    if (!isMember) {
      return NextResponse.json(
        { message: "워크스페이스 권한이 없습니다." },
        { status: 403 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId,
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("프로젝트 생성 오류:", error)
    return NextResponse.json({ message: "서버 오류" }, { status: 500 })
  }
}

// 프로젝트 목록 조회 API
// src/app/api/projects/route.ts

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 워크스페이스 ID 추출
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json(
        { message: "workspaceId가 필요합니다." },
        { status: 400 }
      )
    }

    // 유저가 이 워크스페이스에 속한지 확인
    const isMember = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspaceId,
      },
    })

    // 유저 접근 권한 확인
    if (!isMember) {
      return NextResponse.json(
        { message: "워크스페이스 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 프로젝트 목록 조회
    const projects = await prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" }, // 최신 순으로 정렬
    })

    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error("프로젝트 목록 조회 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
