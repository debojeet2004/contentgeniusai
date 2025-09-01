import React, { ReactNode } from "react";
import { AppSidebar } from "@/app/(dashboard)/_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthCheck } from "./authCheck";

export default function layout({ children }: { children: ReactNode }) {

  return (
    <SidebarProvider>
      <AuthCheck>
        <AppSidebar/>
        <SidebarInset>{children}</SidebarInset>
      </AuthCheck>
    </SidebarProvider>
  );
}
