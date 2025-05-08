import { create } from "zustand"
import { WorkspaceStore } from "@/types/workspace"

// 워크스페이스 스토어 생성
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  // 현재 워크스페이스
  current: null,
  // 워크스페이스 설정
  setWorkspace: (workspace) => set({ current: workspace }),
  // 워크스페이스 초기화
  clearWorkspace: () => set({ current: null }),
}))
