import { useCallback, useState } from "react"

import type { Herb } from "@/app/medical-records/interfaces/types"
import {
  DEFAULT_HERB_DECOCTION_ORDER,
  DEFAULT_HERB_DECOCTION_PREP,
  type HerbDecoctionOrder,
  type HerbDecoctionPrep,
} from "@/app/medical-records/constants/herb-decoction"
import { buildHerbFromMedicine } from "@/app/medical-records/utils/herb-pricing"
import type { Medicine } from "@/app/medicines/types/medicine"

/**
 * Hook để quản lý bản nháp của công thức dược liệu
 * phục vụ cho việc hiển thị và thao tác trên công thức dược liệu
 */
export function useFormulaHerbDraft() {
  const [herbs, setHerbs] = useState<Herb[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  )
  const [tempQuantity, setTempQuantity] = useState<number | "">("")
  const [decoctionOrder, setDecoctionOrder] = useState<HerbDecoctionOrder>(
    DEFAULT_HERB_DECOCTION_ORDER
  )
  const [decoctionPrep, setDecoctionPrep] = useState<HerbDecoctionPrep>(
    DEFAULT_HERB_DECOCTION_PREP
  )

  const resetDraft = useCallback(() => {
    setSelectedMedicine(null)
    setTempQuantity("")
    setDecoctionOrder(DEFAULT_HERB_DECOCTION_ORDER)
    setDecoctionPrep(DEFAULT_HERB_DECOCTION_PREP)
  }, [])

  const resetAll = useCallback(
    (nextHerbs: Herb[] = []) => {
      setHerbs(nextHerbs)
      resetDraft()
    },
    [resetDraft]
  )

  const quantityNumber = Number(tempQuantity)
  const canAdd =
    !!selectedMedicine && Number.isFinite(quantityNumber) && quantityNumber > 0

  const addHerb = useCallback(() => {
    if (!selectedMedicine || !canAdd) return
    const herb = buildHerbFromMedicine(selectedMedicine, quantityNumber, {
      decoctionOrder,
      decoctionPrep,
    })
    setHerbs((prev) => [...prev, herb])
    resetDraft()
  }, [
    selectedMedicine,
    canAdd,
    quantityNumber,
    decoctionOrder,
    decoctionPrep,
    resetDraft,
  ])

  const removeHerb = useCallback((index: number) => {
    setHerbs((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return {
    herbs,
    selectedMedicine,
    setSelectedMedicine,
    tempQuantity,
    setTempQuantity,
    decoctionOrder,
    setDecoctionOrder,
    decoctionPrep,
    setDecoctionPrep,
    canAdd,
    addHerb,
    removeHerb,
    resetAll,
  }
}
