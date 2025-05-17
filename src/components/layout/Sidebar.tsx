"use client"

import { useEffect, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"

import { Project } from "@/types/project"
import { getProjects } from "@/lib/api/project"
import { cn } from "@/lib/utils"

import { PlusCircle, Folder, Home } from "lucide-react"
import { ProjectCreateModal } from "@/components/project/ProjectCreateModal"

// 사이드바 컴포넌트
export function Sidebar() {
  const params = useParams() // URL 파라미터
  const pathname = usePathname() // 현재 경로

  // 공간 식별자 추출
  const workspaceSlug = params.workspaceSlug as string

  // 프로젝트 목록
  const [projects, setProjects] = useState<Project[]>([])

  // 프로젝트 생성 모달 상태
  const [isProjectCreateModalOpen, setIsProjectCreateModalOpen] =
    useState(false)

  // 프로젝트 목록 조회
  useEffect(() => {
    if (!workspaceSlug) return

    // 프로젝트 목록 조회 API 호출
    const fetchProjects = async () => {
      try {
        const projects = await getProjects(workspaceSlug)
        // 프로젝트 목록 상태 업데이트
        setProjects(projects)
      } catch (err) {
        console.error("프로젝트 목록 불러오기 실패", err)
      }
    }

    // 페이지 로드 시 프로젝트 목록 조회
    fetchProjects()
  }, [workspaceSlug]) // 공간 식별자가 변경될 때마다 프로젝트 목록 조회

  // 프로젝트 생성 완료 핸들러
  const handleProjectCreated = (project: Project) => {
    // 프로젝트 목록 상태 업데이트(기존 프로젝트 목록에 생성된 프로젝트 추가)
    setProjects([...projects, project])
    // 프로젝트 생성 모달 닫기
    setIsProjectCreateModalOpen(false)
  }

  // 공간 홈 경로
  const workspaceHomeHref = `/workspace/${workspaceSlug}`
  // 공간 홈 활성화 여부 확인
  const isWorkspaceHomeActive = pathname === workspaceHomeHref

  return (
    <aside className="w-60 h-full border-r bg-gray-50">
      <div className="px-2 py-5">
        {/* 공간 홈 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={workspaceHomeHref}
            className={cn(
              "flex items-center space-x-2 w-full py-2 px-2 rounded-md text-sm transition-colors",
              isWorkspaceHomeActive
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Home
              size={16}
              className={cn(
                isWorkspaceHomeActive ? "text-blue-600" : "text-gray-600"
              )}
            />
            <h2 className="font-semibold text-sm">공간 홈</h2>
          </Link>
        </div>

        {/* 프로젝트 목록 */}
        <nav className="space-y-4">
          <div>
            {/* 프로젝트 목록 헤더 */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                프로젝트 ({projects.length})
              </p>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsProjectCreateModalOpen(true)}
              >
                <PlusCircle size={16} />
              </button>
            </div>

            {/* 프로젝트 목록 */}
            {projects.length > 0 && (
              <div className="space-y-1">
                {projects.map((project) => {
                  const href = `/workspace/${workspaceSlug}/project/${project.slug}`
                  const isActive = pathname.includes(href)

                  return (
                    <Link
                      key={project.id}
                      href={href}
                      className={cn(
                        "flex items-center py-2 px-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Folder
                        size={16}
                        className={cn(
                          "mr-2",
                          isActive ? "text-blue-600" : "text-gray-400"
                        )}
                      />
                      <span className="truncate">{project.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* 프로젝트가 없는 경우 */}
            {projects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 px-3 bg-white rounded-md border border-dashed border-gray-300">
                <p className="text-xs text-gray-500 text-center">
                  프로젝트가 없습니다
                </p>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* 프로젝트 생성 모달 */}
      <ProjectCreateModal
        isOpen={isProjectCreateModalOpen}
        onRequestClose={() => setIsProjectCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        workspaceSlug={workspaceSlug}
      />
    </aside>
  )
}
