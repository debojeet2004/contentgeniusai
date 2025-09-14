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
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { FileText, Image, InfoIcon, Settings, Settings2 } from "lucide-react";

const dashboardNav = [
  {
    title: "Generate Blogs",
    url: "/generate-blogs",
    icon: FileText,
  },
  {
    title: "Setting",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");

  if (!session) {
    redirect("/login");
  }
  const brandSlug = pathname.match(/\/manage-brands\/([^/]+)/)?.[1] ?? "";

  const user = {
    name: session.data?.user?.name as string,
    email: session.data?.user?.email as string,
    image: session.data?.user?.image as string,
  };
  const manageBrandsNav = [
    {
      title: "Brand Information",
      url: `/manage-brands/${brandSlug}?id=${brandId}&tab=brandInfo`,
      icon: InfoIcon,
    },
    {
      title: "Brand Assets",
      url: `/manage-brands/${brandSlug}?id=${brandId}&tab=brandAssets`,
      icon: Image,
    },
    {
      title: "Danger Zone",
      url: `/manage-brands/${brandSlug}?id=${brandId}&tab=danger`,
      icon: Settings2,
    },
  ];

  
  const isManageBrandsPage = pathname.includes("/manage-brands/");
  const { navItems, Category } = isManageBrandsPage 
    ? { navItems: manageBrandsNav, Category: "Manage Brand" }
    : { navItems: dashboardNav, Category: "Platform" };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BrandSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} itemsCategory={Category} type="normal" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
