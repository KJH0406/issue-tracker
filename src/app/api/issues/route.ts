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

    // 이슈 생성 요청 데이터 파싱
    const { title, description, workspaceSlug, projectSlug } = await req.json()

    // 이슈 생성 요청 데이터 검증
    if (!title || !workspaceSlug || !projectSlug) {
      return NextResponse.json(
        { message: "title, workspaceSlug, projectSlug는 필수입니다." },
        { status: 400 }
      )
    }

    // 워크스페이스 조회
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })
    if (!workspace) {
      return NextResponse.json(
        { message: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 프로젝트 조회
    const project = await prisma.project.findFirst({
      where: {
        slug: projectSlug,
        workspaceId: workspace.id,
      },
    })
    if (!project) {
      return NextResponse.json(
        { message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 권한 확인
    const isMember = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.userId,
        workspaceId: workspace.id,
      },
    })

    // 권한 확인 실패 시 403 오류 반환
    if (!isMember) {
      return NextResponse.json(
        { message: "워크스페이스 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 이슈 생성
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        authorId: user.userId,
        projectId: project.id,
      },
    })

    // 이슈 생성 성공 시 이슈 데이터 반환
    return NextResponse.json({ issue }, { status: 201 })
  } catch (error) {
    console.error("이슈 생성 오류:", error)
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 })
  }
}

// 이슈 목록 조회
export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않았습니다." },
      { status: 401 }
    )
  }

  // 쿼리 파라미터 추출
  const { searchParams } = new URL(req.url)
  const workspaceSlug = searchParams.get("workspaceSlug")
  const projectSlug = searchParams.get("projectSlug")

  // 쿼리 파라미터가 없으면 400 오류 반환
  if (!workspaceSlug || !projectSlug) {
    return NextResponse.json(
      { message: "쿼리 누락: workspaceSlug, projectSlug 필요" },
      { status: 400 }
    )
  }

  // 워크스페이스 조회
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
  })

  // 워크스페이스가 존재하지 않으면 404 오류 반환
  if (!workspace) {
    return NextResponse.json(
      { message: "워크스페이스를 찾을 수 없습니다." },
      { status: 404 }
    )
  }

  // 유저가 워크스페이스에 속한 멤버인지 확인
  const isMember = await prisma.workspaceUser.findFirst({
    where: {
      userId: user.userId,
      workspaceId: workspace.id,
    },
  })

  // 유저가 워크스페이스에 속한 멤버가 아니면 403 오류 반환
  if (!isMember) {
    return NextResponse.json(
      { message: "워크스페이스 접근 권한이 없습니다." },
      { status: 403 }
    )
  }

  // 프로젝트 조회
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      workspaceId: workspace.id,
    },
  })

  // 프로젝트가 존재하지 않으면 404 오류 반환
  if (!project) {
    return NextResponse.json(
      { message: "프로젝트를 찾을 수 없습니다." },
      { status: 404 }
    )
  }

  // 이슈 목록 조회
  const issues = await prisma.issue.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
    },
  })

  // 이슈 목록 반환
  return NextResponse.json({ issues })
}
