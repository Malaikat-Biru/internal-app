export class ApiError extends Error {
  constructor({
    message = "Terjadi kesalahan.",
    status = 500,
    code = null,
    errors = null,
    data = null,
  }) {
    super(message)

    this.name = "ApiError"
    this.status = status
    this.code = code
    this.errors = errors
    this.data = data
  }
}