import { Navigate, Outlet } from "react-router-dom"

import { useCurrentUser } from "@/features/auth/api/auth.query"

export default function ProtectedRoute() {
  const {
    data,
    isLoading,
    isError,
  } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Memuat workspace...
        </p>
      </div>
    )
  }

  if (isError || !data?.data) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}