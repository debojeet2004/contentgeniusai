"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { BrandSwitcher } from "@/app/(dashboard)/_components/brand-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const data = {
  Platform: [
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: FileTextIcon,
    // },
  ],
};



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();

  if (!session) {
    redirect("/login");
  }

  const user = {
    name: session.data?.user?.name as string,
    email: session.data?.user?.email as string,
    image: session.data?.user?.image as string,
  };
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BrandSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.Platform} itemsCategory="Platform" type="normal" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
