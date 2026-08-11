import axios from "axios"

import { clearAccessToken, getAccessToken } from "@/lib/auth-token"
import { resetSession } from "@/lib/reset-session"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

instance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }
  return config
})

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // Token hết hạn / không hợp lệ → đăng xuất và đẩy về trang đăng nhập.
    if (error.response?.status === 401) {
      clearAccessToken()
      void resetSession()
      if (window.location.pathname !== "/login") {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  }
)

export default instance
