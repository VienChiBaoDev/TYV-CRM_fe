export type Response<T> = {
  data: T
  message: string
  status: "success" | "error"
  statusCode: number
}
