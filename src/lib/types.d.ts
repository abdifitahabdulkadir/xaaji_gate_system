type ActionResponse<T = null> = {
  data?: T
  success: boolean
  Errors?: {
    message?: string
    statusCode: number
  }
}
