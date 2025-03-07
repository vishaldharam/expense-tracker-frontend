"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


const QueryProvider = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient(); // Create QueryClient instance

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  )
}

export default QueryProvider
