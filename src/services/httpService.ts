import axios from "axios"

import { resetSession } from "@/lib/reset-session"
import { getAuthToken } from "@/stores/auth-store"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

instance.interceptors.request.use(
  function (config) {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // Token hết hạn / không hợp lệ → đăng xuất và đẩy về trang đăng nhập.
    if (error.response?.status === 401) {
      resetSession()
      if (window.location.pathname !== "/login") {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  }
)

export default instance
