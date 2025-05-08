import { create } from "zustand"
import { persist } from "zustand/middleware"
import { WorkspaceStore } from "@/types/workspace"

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      current: null,
      setWorkspace: (workspace) => set({ current: workspace }),
      clearWorkspace: () => set({ current: null }),
    }),
    {
      name: "current-workspace", // localStorage key
    }
  )
)
