import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { urlPaths } from "@/constants/urlPaths"
import { login } from "@/services/authService"
import { useAuthStore } from "@/stores/auth-store"

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { accessToken, user } = await login({ email, password })
      setAuth(accessToken, user)
      navigate(urlPaths.medicalRecordList, { replace: true })
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ??
          "Đăng nhập thất bại, vui lòng thử lại")
        : "Đăng nhập thất bại, vui lòng thử lại"
      setError(Array.isArray(message) ? message[0] : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="font-display text-4xl font-semibold text-emerald-700">
            §
          </span>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-800">
            Thượng Y Viên
          </h1>
          <p className="text-[11px] font-medium tracking-widest text-emerald-600 uppercase">
            Nhân • Tâm • Trí
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@tyv.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
          Tài khoản demo: admin@tyv.vn / doctor@tyv.vn / assistant@tyv.vn /
          staff@tyv.vn
          <br />
          Mật khẩu chung: <span className="font-mono">123456</span>
        </p>
      </div>
    </div>
  )
}
