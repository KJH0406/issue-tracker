"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getStatusStyle } from "@/lib/utils"
import { getIssue, updateIssueStatus } from "@/lib/api/issue"
import { IssueStatus } from "@prisma/client"
import { ArrowLeft, Badge } from "lucide-react"
import { toast } from "react-hot-toast"
import { deleteComment, getComments } from "@/lib/api/comment"
import { createComment } from "@/lib/api/comment"

// 이슈 상세 페이지
export function IssueDetail() {
  const router = useRouter()
  const { workspaceSlug, projectSlug, issueNumber } = useParams()
  const [issue, setIssue] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  // 댓글 영역 관련 상태
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [commentContent, setCommentContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const issue = await getIssue(
          Number(issueNumber),
          workspaceSlug as string,
          projectSlug as string
        )
        setIssue(issue)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchIssue()
  }, [workspaceSlug, projectSlug, issueNumber])

  useEffect(() => {
    if (!issue) return
    const fetchComments = async () => {
      setCommentsLoading(true)
      try {
        const data = await getComments(issue.id)
        setComments(data)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setCommentsLoading(false)
      }
    }

    fetchComments()
  }, [issue])

  // 이슈 상태 변경
  const handleChangeStatus = async (newStatus: string) => {
    if (!issue) return
    setUpdating(true)
    try {
      const updatedIssue = await updateIssueStatus(
        issue.id,
        newStatus as IssueStatus
      )

      setIssue(updatedIssue) // 상태 즉시 반영
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      toast.success("이슈 상태가 변경되었습니다.")
      setUpdating(false)
    }
  }

  if (loading) return <p>이슈 불러오는 중...</p>
  if (error) return <p className="text-red-500">오류: {error}</p>
  if (!issue) return <p>이슈 없음</p>

  // 이슈 상태 스타일
  const status = getStatusStyle(issue.status)

  // 이슈 목록으로 돌아가는 함수
  const goBackToIssueList = () => {
    router.push(`/workspace/${workspaceSlug}/project/${projectSlug}`)
  }

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      toast.error("댓글 내용을 입력해주세요.")
      return
    }
    setSubmitting(true)
    try {
      await createComment(issue.id, commentContent)
      toast.success("댓글이 작성되었습니다.")
      setCommentContent("")
      const data = await getComments(issue.id)
      setComments(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return
    try {
      await deleteComment(commentId)
      toast.success("댓글이 삭제되었습니다.")
      const data = await getComments(issue.id)
      setComments(data)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* 헤더 영역 - 뒤로가기 버튼 */}
      <div className="flex items-center">
        <button
          onClick={goBackToIssueList}
          className="flex items-center text-sm text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          이슈 목록으로 돌아가기
        </button>
      </div>
      {/* 이슈 번호 */}
      <span className="text-gray-500 text-sm">
        #{projectSlug}-{issue.number}
      </span>
      {/* 이슈 제목 */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">{issue.title}</h1>
      </div>

      {/* 메타데이터 그리드 */}
      <div className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* 상태 */}
        <div className="flex items-center">
          <div className="w-32 text-sm text-gray-500">상태</div>
          <div>
            <select
              value={issue.status}
              onChange={(e) => handleChangeStatus(e.target.value)}
              disabled={updating}
              className={`border rounded-md px-3 py-1.5 text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            >
              {Object.values(IssueStatus).map((statusOption) => {
                const statusStyle = getStatusStyle(statusOption)
                return (
                  <option
                    key={statusOption}
                    value={statusOption}
                    className={`flex items-center ${statusStyle.color}`}
                  >
                    <span
                      className={`w-2 h-2 mr-2 rounded-full ${statusStyle.color}`}
                    ></span>
                    {statusStyle.label}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* 담당자 */}
        <div className="flex items-center">
          <div className="w-32 text-sm text-gray-500">담당자</div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-600">
              {issue.author?.username?.charAt(0) || "?"}
            </div>
            <span className="ml-2 text-sm">
              {issue.author?.username || "미배정"}
            </span>
          </div>
        </div>

        {/* 날짜 */}
        <div className="flex items-center">
          <div className="w-32 text-sm text-gray-500">날짜</div>
          <div className="text-sm">
            {new Date(issue.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      {/* 설명 영역 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">설명</h3>
        <div className="prose prose-sm max-w-none">
          {issue.description ? (
            <p className="text-gray-700 whitespace-pre-wrap">
              {issue.description}
            </p>
          ) : (
            <p className="text-gray-400 italic">설명 없음</p>
          )}
        </div>
      </div>

      {/* --- 댓글 영역 추가 --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          댓글 ({comments.length})
        </h3>

        {/* 댓글 목록 */}
        {commentsLoading ? (
          <p>댓글 불러오는 중...</p>
        ) : comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b pb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    {comment.author?.username || "알 수 없음"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
                {/* 본인인 경우에만 삭제 버튼 */}
                {String(comment.authorId) === String(issue.authorId) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">댓글 없음</p>
        )}

        {/* 댓글 작성 */}
        <div className="mt-4 space-y-2">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={3}
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          ></textarea>
          <div className="flex justify-end">
            <button
              onClick={handleSubmitComment}
              disabled={submitting}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              {submitting ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
