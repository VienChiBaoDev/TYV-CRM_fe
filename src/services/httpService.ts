import axios, {
  AxiosError,
  CanceledError,
  type InternalAxiosRequestConfig,
} from "axios"

import API_PATHS from "@/constants/apiPaths"
import { CSRF_COOKIE, CSRF_HEADER, readCookie } from "@/lib/csrf"
import { isSessionResetInProgress, resetSession } from "@/lib/reset-session"
import { urlPaths } from "@/constants/urlPaths"

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

instance.interceptors.request.use((config) => {
  if (isSessionResetInProgress()) {
    return Promise.reject(new CanceledError("Session reset in progress"))
  }
  const csrf = readCookie(CSRF_COOKIE)
  if (csrf) {
    config.headers.set(CSRF_HEADER, csrf)
  }
  return config
})

let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  try {
    await instance.post(API_PATHS.AUTH.REFRESH)
    return true
  } catch {
    return false
  }
}

function isAuthPath(url?: string): boolean {
  if (!url) return false
  return (
    url.includes(API_PATHS.AUTH.LOGIN) ||
    url.includes(API_PATHS.AUTH.REFRESH) ||
    url.includes(API_PATHS.AUTH.LOGOUT)
  )
}

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined
    if (
      error.response?.status !== 401 ||
      !config ||
      config._retry ||
      isAuthPath(config.url)
    ) {
      if (
        error.response?.status === 401 &&
        !isAuthPath(config?.url) &&
        !isSessionResetInProgress()
      ) {
        void resetSession()
        if (window.location.pathname !== urlPaths.login) {
          window.location.assign(urlPaths.login)
        }
      }
      return Promise.reject(error)
    }

    config._retry = true
    refreshPromise ??= tryRefresh().finally(() => {
      refreshPromise = null
    })
    const ok = await refreshPromise
    if (ok) {
      return instance.request(config)
    }

    if (!isSessionResetInProgress()) {
      void resetSession()
      if (window.location.pathname !== urlPaths.login) {
        window.location.assign(urlPaths.login)
      }
    }
    return Promise.reject(error)
  }
)

export default instance
