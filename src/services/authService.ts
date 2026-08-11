import API_PATHS from "@/constants/apiPaths"
import type { AuthUser, LoginRequest, LoginResponse } from "@/interfaces/auth"
import { postLogout } from "@/lib/post-logout"
import httpService from "@/services/httpService"

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpService.post<LoginResponse>(
    API_PATHS.AUTH.LOGIN,
    payload
  )
  return data
}

export async function logout(): Promise<void> {
  try {
    await postLogout()
  } catch {
    // Cookie có thể đã hết hạn.
  }
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await httpService.get<AuthUser>(API_PATHS.AUTH.ME)
  return data
}

export async function refreshSession(): Promise<LoginResponse> {
  const { data } = await httpService.post<LoginResponse>(API_PATHS.AUTH.REFRESH)
  return data
}
