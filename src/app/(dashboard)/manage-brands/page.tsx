"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import BreadcrumbHelper from "@/components/breadcrumb-helper";
import CreateBrand from "../_components/createBrand";
import BrandCard, { BrandType } from "./_Components/BrandCard";
import { Building2, Loader2 } from "lucide-react";


export default function BrandsPage() {
  const { data: organizations, isPending } = authClient.useListOrganizations();

  // console.log("organizations form manage-brand Page.tsx :",organizations)
  const BreadcrumbItems = [
    { name: "Dashboard", href: { pathname: "/dashboard" } },
    { name: "Manage Brands", href: { pathname: "/manage-brands" } },
  ];

  return (
    <div className="px-4 w-full space-y-8">
      <BreadcrumbHelper triggerNeeded breadcrumbItems={BreadcrumbItems} />
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-start items-end gap-3">
            <span>Manage Brand Profiles</span>
            <div className="w-fit flex items-center gap-6 shrink-0 bg-amber-50/40 dark:bg-amber-900/10 p-1.5 rounded-lg border border-amber-200/30 dark:border-amber-700/20 shadow-sm">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs text-amber-700/50 dark:text-amber-300/70 font-medium">
                  Total Brands
                </span>
                <Badge
                  variant="secondary"
                  className="flex justify-center items-center font-semibold text-[10px] rounded-xl px-2 bg-amber-100 dark:bg-amber-800/20 text-amber-800 dark:text-amber-200 border border-amber-200/20 dark:border-amber-700/10"
                >
                  {organizations?.length || 0}
                </Badge>
              </div>
            </div>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Manage your brand profiles, including descriptions, mission
            statements, industries, target audiences, voice tones, unique
            selling points, and competitors.
          </p>
        </div>
        <div className="w-fit">
          <CreateBrand variant="default" />
        </div>
      </div>

      {isPending ? (
        <div className="h-full w-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : organizations?.length === 0 ? (
        <div className="max-w-4xl mx-auto mt-16 flex flex-col items-center justify-center gap-6 p-12 bg-gradient-to-b from-transparent to-muted/5 rounded-lg border border-dashed border-muted ">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full"></div>
            <Building2 className="w-12 h-12 text-muted-foreground/30" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-xl">No Brands Yet</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Create your first brand profile to start managing your brand
              identity and marketing strategy.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations?.map((org) => (
            <BrandCard key={org.id} org={org as BrandType} />
          ))}
        </div>
      )}
    </div>
  );
}


