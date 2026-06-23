import { create } from "zustand"

export type ClinicBranch = "Hàng Bông" | "Cầu Giấy"

interface ClinicStore {
  activeBranch: ClinicBranch
  setActiveBranch: (branch: ClinicBranch) => void
}

export const useClinicStore = create<ClinicStore>((set) => ({
  activeBranch: "Hàng Bông",
  setActiveBranch: (branch) => set({ activeBranch: branch }),
}))
