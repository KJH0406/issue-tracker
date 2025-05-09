"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { Project } from "@/types/project"
import { cn } from "@/lib/utils"
import { getProjects } from "@/lib/api/project"
import { PlusCircle, Folder, Home } from "lucide-react"
import { ProjectCreateModal } from "@/components/project/ProjectCreateModal"
export function Sidebar() {
  const params = useParams()
  const pathname = usePathname()

  // slug는 전역 상태가 없으면 URL에서 추출
  const workspaceSlug = params.workspaceSlug as string

  const [projects, setProjects] = useState<Project[]>([])

  const [isProjectCreateModalOpen, setIsProjectCreateModalOpen] =
    useState(false)

  useEffect(() => {
    if (!workspaceSlug) return

    const fetchProjects = async () => {
      try {
        const projects = await getProjects(workspaceSlug)
        setProjects(projects)
      } catch (err) {
        console.error("프로젝트 목록 불러오기 실패", err)
      }
    }

    fetchProjects()
  }, [workspaceSlug])

  const handleProjectCreated = (project: Project) => {
    setProjects([...projects, project])
    setIsProjectCreateModalOpen(false)
  }

  return (
    <aside className="w-60 h-full border-r bg-gray-50">
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/workspace/${workspaceSlug}`}
            className="flex items-center space-x-2 w-full hover:bg-gray-100 transition-colors"
          >
            <Home size={16} className="text-gray-600" />
            <h2 className="font-semibold text-gray-800 text-sm">공간 홈</h2>
          </Link>
        </div>

        <nav className="space-y-4">
          <div>
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

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-3 bg-white rounded-md border border-dashed border-gray-300">
                <p className="text-xs text-gray-500 text-center">
                  프로젝트가 없습니다
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {projects.map((project) => {
                  const href = `/workspace/${workspaceSlug}/project/${project.slug}`
                  const isActive = pathname === href

                  return (
                    <Link
                      key={project.id}
                      href={href}
                      className={cn(
                        "flex items-center py-2 rounded-md text-sm transition-colors",
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
          </div>
        </nav>
      </div>
      <ProjectCreateModal
        isOpen={isProjectCreateModalOpen}
        onRequestClose={() => setIsProjectCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        workspaceSlug={workspaceSlug}
      />
    </aside>
  )
}
