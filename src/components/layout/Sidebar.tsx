// src/components/layout/Sidebar.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  { label: "내 워크스페이스", href: "/workspaces" },
  { label: "대시보드", href: "/dashboard" },
  { label: "프로젝트", href: "/projects" },
  { label: "설정", href: "/settings" },
]

// 사이드바 컴포넌트
export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 h-full border-r px-4 py-6">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium",
              pathname === item.href && "bg-gray-200 font-semibold"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
