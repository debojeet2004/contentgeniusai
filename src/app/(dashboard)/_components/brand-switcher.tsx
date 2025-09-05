"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import CreateBrand from "@/app/(dashboard)/_components/createBrand";
import { authClient } from "@/lib/auth-client";
import { ChevronsUpDown, CirclePlus, Flower, Settings2 } from "lucide-react";
import Link from "next/link";

// Types
interface ActiveBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

interface BrandLogoProps {
  logo?: string | null;
  name?: string;
  size?: number;
}

interface DropdownContentProps {
  isMobile: boolean;
  organizations: ActiveBrand[];
  onBrandSwitch: (org: ActiveBrand) => void;
}

// Reusable Components
const BrandLogo: React.FC<BrandLogoProps> = ({ logo, name, size = 28 }) => (
  <div className="flex items-center justify-center">
    {logo ? (
      <img
        width={size}
        height={size}
        src={logo}
        alt={`${name} logo`}
        className="object-cover rounded-md"
      />
    ) : (
      <Flower className={`h-${size/5} w-${size/5} text-foreground/40`} />
    )}
  </div>
);

const DropdownContent: React.FC<DropdownContentProps> = ({ isMobile, organizations, onBrandSwitch }) => (
  <DropdownMenuContent
    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md border border-accent/50"
    align="start"
    side={isMobile ? "bottom" : "right"}
    sideOffset={4}
  >
    <DropdownMenuLabel className="text-muted-foreground text-xs">
      Brands
    </DropdownMenuLabel>
    <DropdownMenuSeparator className="bg-accent/80" />
    {organizations.map((org) => (
      <DropdownMenuItem
        key={org.id}
        onClick={() => onBrandSwitch(org)}
        className="gap-2 "
      >
        <div className="flex size-6 items-center justify-center rounded-md">
          <BrandLogo logo={org.logo} name={org.name} size={22} />
        </div>
        {org.name}
      </DropdownMenuItem>
    ))}
    <DropdownMenuSeparator className="bg-accent/80" />
    <ManageBrandsMenuItem />
    <CreateBrand variant="ghost" />
  </DropdownMenuContent>
);

const ManageBrandsMenuItem = () => (
  <DropdownMenuItem asChild className="gap-2 p-2">
    <Link href="/manage-brands" className="flex items-center">
      <div className="flex size-6 items-center justify-center rounded border">
        <Settings2 className="h-4 w-4" />
      </div>
      <span className="text-muted-foreground font-medium">
        Manage Brands
      </span>
    </Link>
  </DropdownMenuItem>
);

// Main Component
export function BrandSwitcher() {
  const { isMobile } = useSidebar();
  const [activeBrand, setActiveBrand] = useState<ActiveBrand>();

  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { data: sessionActiveOrg, isPending: isSessionLoading } = authClient.useActiveOrganization();

  // Handle active brand updates
  useEffect(() => {
    if (organizations === undefined || isSessionLoading) return;
    
    const hasOrganizations = organizations && organizations.length > 0;
    
    if (hasOrganizations && sessionActiveOrg) {
      setActiveBrand(sessionActiveOrg);
    } else {
      setActiveBrand(undefined);
    }
  }, [organizations, sessionActiveOrg, isSessionLoading]);

  const handleBrandSwitch = async (org: ActiveBrand) => {
    await authClient.organization.setActive({
      organizationId: org.id,
      organizationSlug: org.slug,
    });
    setActiveBrand(org);
  };

  // Render states
  if (isPending) return <BrandSkeleton />;
  if (!organizations?.length) return <EmptyBrandState isMobile={isMobile} />;
  if (!activeBrand) {
    return (
      <NoActiveBrandState 
        isMobile={isMobile} 
        organizations={organizations} 
        onSelectBrand={handleBrandSwitch} 
      />
    );
  }

  // Render active brand state
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group/sidebar bg-accent/40"
            >
              <div className="bg-accent/90 group-hover/sidebar:bg-foreground/20 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg relative">
                <BrandLogo logo={activeBrand.logo} name={activeBrand.name} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeBrand.name}</span>
                <span className="text-xs text-muted-foreground/80">Brand Dashboard</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownContent 
            isMobile={isMobile}
            organizations={organizations}
            onBrandSwitch={handleBrandSwitch}
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// Keep existing BrandSkeleton, EmptyBrandState, and NoActiveBrandState components as is
const BrandSkeleton = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="w-full">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-stone-100 dark:bg-stone-800/40">
            <div className="bg-stone-200 dark:bg-stone-700 animate-pulse flex aspect-square size-8 items-center justify-center rounded-lg" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-stone-200 dark:bg-stone-700 animate-pulse rounded-md w-32" />
              <div className="h-3 bg-stone-200 dark:bg-stone-700 animate-pulse rounded-md w-20" />
            </div>
            <div className="w-4 h-4 bg-stone-200 dark:bg-stone-700 animate-pulse rounded-md" />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const EmptyBrandState = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-accent/50 hover:bg-accent/80 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping [animation-duration:3s]"></div>
                  <div className="relative bg-primary/10 p-1.5 rounded-full">
                    <CirclePlus className="h-5 w-5 text-primary animate-pulse [animation-duration:2s]" />
                  </div>
                </div>
                <div className="flex flex-col flex-1 text-left">
                  <span className="text-sm font-semibold tracking-tight">
                    Create Your Brand
                  </span>
                  <span className="text-xs text-muted-foreground/80">
                    Get started →
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground text-xs">
              Add New Brand
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CreateBrand variant="ghost" />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const NoActiveBrandState = ({ isMobile, organizations, onSelectBrand }: { isMobile: boolean, organizations: ActiveBrand[], onSelectBrand: (org: ActiveBrand) => void }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-accent/50 hover:bg-accent/80 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="relative bg-primary/10 p-1.5 rounded-full">
                    <Flower className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex flex-col flex-1 text-left">
                  <span className="text-sm font-semibold tracking-tight">
                    Select a Brand
                  </span>
                  <span className="text-xs text-muted-foreground/80">
                    Choose one to get started →
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownContent
            isMobile={isMobile}
            organizations={organizations}
            onBrandSwitch={onSelectBrand}
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
