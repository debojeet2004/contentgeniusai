"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, ExternalLinkIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BreadcrumbHelper from "@/components/breadcrumb-helper";
import CreateBrand from "../_components/createBrand";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface BrandType {
  id: string;
  name: string;
  slug: string;
  logo?: string | null | undefined;
  description?: string;
  brandmission?: string[];
  industry?: ('technology' | 'healthcare' | 'finance' | 'education' | 'entertainment' | 'other')[];
  targetaudience?: ('business' | 'consumer' | 'general' | 'student')[];
  voicetone?: ('formal' | 'informal' | 'casual' | 'consise')[];
  uniqsellingpoints?: string[];
  competitor?: string[];
  metadata?: string;
  createdAt: Date;
}

export default function BrandsPage() {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const BreadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Manage Brands", href: "/manage-brands" },
  ];

  return (
    <div className="p-4 w-full space-y-8">
      <BreadcrumbHelper triggerNeeded breadcrumbItems={BreadcrumbItems} />
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex justify-start items-end gap-3">
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
        <div className="w-full flex justify-center items-center">
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
            <BrandCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  );
}

function BrandCard({ org }: { org: BrandType }) {
  const formattedDate = org?.createdAt
    ? new Date(org.createdAt).toLocaleDateString()
    : "No date available";
  const truncatedDescription =
    org?.description && org.description.length > 150
      ? `${org.description.substring(0, 150)}...`
      : org?.description;

  return (
    <Card className="relative group flex flex-col h-full hover:shadow-xl transition-all duration-300 ease-in-out overflow-clip">
      <div className="absolute inset-0 overflow-hidden transition-all duration-500 group-hover:scale-105">
        {/* Top left circle */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-xl transition-all duration-700 group-hover:bg-primary/10 group-hover:scale-110" />
        {/* Bottom right circle */}
        <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-primary/5 blur-2xl transition-all duration-700 group-hover:bg-primary/10 group-hover:scale-110" />
        {/* Center decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-secondary/5 blur-lg transition-all duration-500 group-hover:bg-secondary/10 group-hover:rotate-90" />
        {/* Additional subtle accent */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full bg-accent/5 blur-lg transition-all duration-300 group-hover:bg-accent/10 group-hover:-translate-y-2" />
      </div>
      <CardHeader className="relative flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {org?.industry && org.industry.length > 0 ? (
              org.industry.map((ind: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="flex items-center gap-1 text-xs"
                >
                  <Building2 className="h-3 w-3" />
                  {ind}
                </Badge>
              ))
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Building2 className="h-3 w-3" />
                No industry specified
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 ">
          <Avatar className="h-14 w-14 shadow-md ">
            <AvatarImage
              src={org?.logo || ""}
              alt={org?.name || "Brand Logo"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {org?.name ? org.name.slice(0, 2).toUpperCase() : "BR"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {org?.name || "Unnamed Brand"}
            </CardTitle>
            {/* <CardDescription className="text-sm">
              {org?.slug ? `@${org.slug}` : "No handle available"}
            </CardDescription> */}
            <span className="text-[10px] italic text-muted-foreground">
              Created: {formattedDate}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1  space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground/40 line-clamp-2 ">
          {truncatedDescription || "No description provided..."}
        </p>

        {/* Action Button */}
        <div className="flex justify-end z-20">
          <Link href={`/manage-brands/${org?.slug}`} >
            <Button variant="outline" size="sm" className="gap-2">
              Manage
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
