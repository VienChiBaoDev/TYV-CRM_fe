import { create } from "zustand"

import type { ClinicBranchLabel } from "@/constants/clinic-branches"

export type ClinicBranch = ClinicBranchLabel

interface ClinicStore {
  activeBranch: ClinicBranch
  setActiveBranch: (branch: ClinicBranch) => void
}

export const useClinicStore = create<ClinicStore>((set) => ({
  activeBranch: "Hàng Bông",
  setActiveBranch: (branch) => set({ activeBranch: branch }),
}))
