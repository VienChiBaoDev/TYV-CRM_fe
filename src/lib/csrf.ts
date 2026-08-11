export const CSRF_COOKIE = "tyv_csrf"
export const CSRF_HEADER = "X-CSRF-Token"

export function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&")}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function csrfHeaders(): Record<string, string> {
  const csrf = readCookie(CSRF_COOKIE)
  return csrf ? { [CSRF_HEADER]: csrf } : {}
}
