import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"
import type { AuthUser, LoginRequest, LoginResponse } from "@/interfaces/auth"
import { clearAccessToken, setAccessToken } from "@/lib/auth-token"

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpService.post<LoginResponse>(
    API_PATHS.AUTH.LOGIN,
    payload
  )
  if (data.accessToken) {
    setAccessToken(data.accessToken)
  }
  return data
}

export async function logout(): Promise<void> {
  try {
    await httpService.post(API_PATHS.AUTH.LOGOUT)
  } finally {
    clearAccessToken()
  }
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await httpService.get<AuthUser>(API_PATHS.AUTH.ME)
  return data
}
