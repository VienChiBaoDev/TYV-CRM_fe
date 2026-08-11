/** Bearer fallback khi Safari chặn cross-site HttpOnly cookie (Vercel ↔ Railway). */
const STORAGE_KEY = "tyv-access-token"

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setAccessToken(token: string | null): void {
  try {
    if (!token) {
      sessionStorage.removeItem(STORAGE_KEY)
      return
    }
    sessionStorage.setItem(STORAGE_KEY, token)
  } catch {
    // private mode / storage blocked — cookie path vẫn dùng được nếu browser cho phép
  }
}

export function clearAccessToken(): void {
  setAccessToken(null)
}
