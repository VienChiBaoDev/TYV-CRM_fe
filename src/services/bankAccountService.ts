import httpService from "@/services/httpService"

export interface BankAccount {
  id: string
  bankName: string
  accountHolder: string
  accountNumber: string
  note: string | null
  isActive: boolean
  sortOrder: number
}

/** Bản rút gọn cho ô chọn tài khoản khi thu / hoàn tiền. */
export interface BankAccountOption {
  id: string
  bankName: string
  accountHolder: string
  accountNumber: string
}

export interface BankAccountPayload {
  bankName: string
  accountHolder: string
  accountNumber: string
  note?: string
  isActive?: boolean
  sortOrder?: number
}

/** "MB Bank - Đặng Hữu Phúc (0123456789)" */
export function formatBankAccountLabel(account: BankAccountOption): string {
  return `${account.bankName} - ${account.accountHolder} (${account.accountNumber})`
}

export async function fetchBankAccounts(): Promise<BankAccount[]> {
  const { data } = await httpService.get<BankAccount[]>("/bank-accounts")
  return data
}

export async function fetchBankAccountOptions(): Promise<BankAccountOption[]> {
  const { data } = await httpService.get<BankAccountOption[]>(
    "/bank-accounts/options"
  )
  return data
}

export async function createBankAccount(
  payload: BankAccountPayload
): Promise<BankAccount> {
  const { data } = await httpService.post<BankAccount>(
    "/bank-accounts",
    payload
  )
  return data
}

export async function updateBankAccount(
  id: string,
  payload: Partial<BankAccountPayload>
): Promise<BankAccount> {
  const { data } = await httpService.patch<BankAccount>(
    `/bank-accounts/${id}`,
    payload
  )
  return data
}

export async function deleteBankAccount(id: string): Promise<void> {
  await httpService.delete(`/bank-accounts/${id}`)
}
