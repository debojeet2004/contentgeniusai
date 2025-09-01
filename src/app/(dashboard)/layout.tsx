import React, { ReactNode } from "react";
import { AppSidebar } from "@/app/(dashboard)/_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: ReactNode;
}) {
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) {
    redirect("/login");
  }

  const user = {
    name: loggedInUser?.name as string,
    email: loggedInUser?.email as string,
    image: loggedInUser?.image as string,
  };

  // console.log(user);

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
