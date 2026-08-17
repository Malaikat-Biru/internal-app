import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { queryClient } from "@/lib/query-client"
import { Toaster } from "sonner"

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        closeButton
        richColors
      />

      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}