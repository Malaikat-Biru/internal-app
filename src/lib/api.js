import { ApiError } from "@/lib/api-error"

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error(
    "VITE_API_URL belum dikonfigurasi. Tambahkan VITE_API_URL di file .env."
  )
}

function buildUrl(path, params) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  const url = new URL(`${API_URL}${normalizedPath}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type")

  if (response.status === 204) {
    return null
  }

  if (contentType?.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

async function request(
  path,
  {
    method = "GET",
    params,
    body,
    headers = {},
    signal,
    credentials = "include",
  } = {}
) {
  const url = buildUrl(path, params)

  const isFormData = body instanceof FormData

  const response = await fetch(url, {
    method,

    credentials,

    headers: {
      Accept: "application/json",

      ...(!isFormData && body
        ? {
            "Content-Type": "application/json",
          }
        : {}),

      ...headers,
    },

    body:
      body === undefined || body === null
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),

    signal,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError({
      message:
        data?.message ||
        data?.error ||
        `Request gagal dengan status ${response.status}.`,

      status: response.status,

      code: data?.code ?? null,

      errors: data?.errors ?? null,

      data,
    })
  }

  return data
}

export const api = {
  get(path, options = {}) {
    return request(path, {
      ...options,
      method: "GET",
    })
  },

  post(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "POST",
      body,
    })
  },

  put(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "PUT",
      body,
    })
  },

  patch(path, body, options = {}) {
    return request(path, {
      ...options,
      method: "PATCH",
      body,
    })
  },

  delete(path, options = {}) {
    return request(path, {
      ...options,
      method: "DELETE",
    })
  },

  upload(path, formData, options = {}) {
    return request(path, {
      ...options,
      method: "POST",
      body: formData,
    })
  },
}