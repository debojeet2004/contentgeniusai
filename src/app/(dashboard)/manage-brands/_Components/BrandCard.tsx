import React from 'react'
import Link from 'next/link'
import { Building2, ExternalLink as ExternalLinkIcon } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'


export interface BrandType {
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
            <span className="text-[10px] italic text-muted-foreground">
              Created: {formattedDate}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground/40 line-clamp-2">
          {truncatedDescription || "No description provided..."}
        </p>

        {/* Action Button */}
        <div className="flex justify-end z-20">
          <Link href={`/manage-brands/${org?.slug}?id=${org?.id}&tab=brandInfo`}>
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

export default BrandCard