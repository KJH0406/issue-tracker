import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 프로젝트 생성
export async function POST(req: Request) {
  // 현재 로그인한 사용자 정보 가져오기
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 요청 본문에서 프로젝트 정보 추출
  const { name, description, workspaceId } = await req.json()

  // 필수 값 검사
  if (!name || !workspaceId) {
    return NextResponse.json(
      { error: "이름과 워크스페이스 ID는 필수입니다." },
      { status: 400 }
    )
  }

  // 워크스페이스가 실제로 존재하는지 확인
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  })

  // 워크스페이스가 존재하지 않으면 404 오류 반환
  if (!workspace) {
    return NextResponse.json(
      { error: "워크스페이스를 찾을 수 없습니다." },
      { status: 404 }
    )
  }

  // 프로젝트 생성
  const project = await prisma.project.create({
    data: {
      name,
      description,
      workspaceId,
      userId: user.userId,
    },
  })

  // 생성된 프로젝트 정보
  return NextResponse.json({ project })
}
