import httpService from "@/services/httpService"

export interface Referrer {
  id: string
  fullName: string
  phone: string | null
  type: string | null
  _count?: { patients: number }
}

export async function getReferrers(search?: string): Promise<Referrer[]> {
  const { data } = await httpService.get<Referrer[]>("/referrers", {
    params: search ? { search } : undefined,
  })
  return data
}
