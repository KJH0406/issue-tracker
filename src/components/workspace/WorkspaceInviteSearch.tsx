"use client"

import { useEffect, useState, useRef } from "react"
import { UserWithStatus } from "@/types/workspace"
import { Search, Loader2, User } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  workspaceSlug: string
  onSelect: (users: UserWithStatus[]) => void
}

export default function WorkspaceInviteSearch({
  workspaceSlug,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserWithStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!query) {
      setResults([]) // 검색어가 비어있을 때 결과 초기화
      return
    }

    const delay = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `/api/user/search?query=${query}&workspaceSlug=${workspaceSlug}`
        )

        if (!res.ok) {
          throw new Error("검색 중 오류가 발생했습니다.")
        }

        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error("검색 오류:", err)
        setError("사용자 검색 중 오류가 발생했습니다.")
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [query, workspaceSlug])

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="이메일 또는 이름으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-9 pr-4 py-2 border rounded w-full"
        />
      </div>

      {isFocused && (query || loading || error) && (
        <ul
          ref={resultsRef}
          className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-[300px] overflow-y-auto"
        >
          {loading && (
            <li className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-muted-foreground">
                검색 중...
              </span>
            </li>
          )}

          {error && (
            <li className="text-sm text-red-500 py-4 text-center">{error}</li>
          )}

          {!loading && !error && results.length === 0 && query && (
            <li className="text-sm text-muted-foreground py-4 text-center">
              검색 결과가 없습니다.
            </li>
          )}

          {!loading &&
            results.length > 0 &&
            results.map((user) => (
              <li key={user.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (!user.isMember) {
                            onSelect([user])
                            setQuery("")
                            setIsFocused(false)
                          }
                        }}
                        disabled={user.isMember}
                        className={`w-full text-left px-4 py-3 flex items-center ${
                          user.isMember
                            ? "bg-gray-100 cursor-not-allowed opacity-70"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        <div className="bg-gray-200 rounded-full p-2 mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </button>
                    </TooltipTrigger>
                    {user.isMember && (
                      <TooltipContent>
                        <p>이미 워크스페이스에 추가된 사용자입니다</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
