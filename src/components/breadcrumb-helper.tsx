import React, { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbHelperProps {
  breadcrumbItems: {
    name: string;
    href: string;
  }[],
  triggerNeeded?: boolean;
}

function BreadcrumbHelper({ breadcrumbItems, triggerNeeded = false }: BreadcrumbHelperProps) {
  return (
    <div className="flex items-center gap-2  pt-4">
        {triggerNeeded && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 ml-0 h-4" />
          </>
        )}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => {
              return (
                <Fragment key={index}>
                  {index > 0 && <ChevronRight className="h-4 w-4" />}
                  <BreadcrumbItem
                    key={index}
                    data-umami-event={`breadcrumb-${item.name}-button`}
                  >
                    <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
  );
}

export default BreadcrumbHelper;
