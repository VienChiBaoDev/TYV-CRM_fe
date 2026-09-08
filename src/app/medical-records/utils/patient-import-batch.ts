/** Khớp BE: import-patients.dto.ts ArrayMaxSize(1000) */
export const PATIENT_IMPORT_BATCH_SIZE = 500

/**
 * Chia mảng thành các mảng con có kích thước size
 * @param items - Mảng cần chia
 * @param size - Kích thước của mỗi mảng con
 * @returns Mảng các mảng con
 */
export function chunkArray<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items]
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}
