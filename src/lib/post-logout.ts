import API_PATHS from "@/constants/apiPaths"
import { csrfHeaders } from "@/lib/csrf"

/** Raw fetch — tránh axios interceptor khi httpService gọi resetSession. */
export async function postLogout(): Promise<void> {
  await fetch(`${import.meta.env.VITE_API_URL}${API_PATHS.AUTH.LOGOUT}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: "{}",
  })
}
