import React from "react";
import { ThemeProvider } from "./theme-provider";
import ModalsProvider from "./modals-provider";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "./query-client-provider";

export const AllProviders = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <QueryClientProvider>
        <ThemeProvider
          forcedTheme="light"
          defaultTheme="light"
          attribute="class"
        >
          <Toaster richColors />
          <ModalsProvider />
          <div className="h-screen">{children}</div>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};
