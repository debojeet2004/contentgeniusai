import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import React from "react";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster richColors position="top-right" duration={1500} />
    </ThemeProvider>
  );
}

export default AppProvider;
