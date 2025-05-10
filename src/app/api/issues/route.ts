import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 이슈 생성
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { message: "인증되지 않았습니다." },
        { status: 401 }
      )
    }

    // 이슈 생성 요청 데이터 추출
    const { title, description, projectId } = await req.json()

    // 제목과 프로젝트 ID는 필수
    if (!title || !projectId) {
      return NextResponse.json(
        { message: "제목과 프로젝트 ID는 필수입니다." },
        { status: 400 }
      )
    }

    // 프로젝트 조회
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    // 프로젝트가 존재하지 않으면 404 오류 반환
    if (!project) {
      return NextResponse.json(
        { message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 유저가 프로젝트의 워크스페이스에 속한 멤버인지 확인
    const isMember = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspaceId: project.workspaceId,
      },
    })

    // 유저가 프로젝트의 워크스페이스에 속한 멤버가 아니면 403 오류 반환
    if (!isMember) {
      return NextResponse.json(
        { message: "프로젝트 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 이슈 생성
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        projectId,
        authorId: user.userId,
      },
    })

    // 이슈 생성 성공 이슈 데이터 반환
    return NextResponse.json({ issue }, { status: 201 })
  } catch (err) {
    console.error("이슈 생성 오류:", err)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}
