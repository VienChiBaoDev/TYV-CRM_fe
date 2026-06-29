import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"
import type { AuthUser, LoginRequest, LoginResponse } from "@/interfaces/auth"

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpService.post<LoginResponse>(
    API_PATHS.AUTH.LOGIN,
    payload
  )
  return data
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await httpService.get<AuthUser>("/auth/me")
  return data
}
