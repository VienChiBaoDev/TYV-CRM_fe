import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      gcTime: 300_000, // 5 minutes
    },
  },
})
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
