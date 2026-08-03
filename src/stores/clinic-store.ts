import { create } from "zustand"

interface ClinicStore {
  activeClinicId: string | null
  setActiveClinicId: (id: string | null) => void
}

export const useClinicStore = create<ClinicStore>((set) => ({
  activeClinicId: null,
  setActiveClinicId: (id) => set({ activeClinicId: id }),
}))
