import React from "react";
import BreadcrumbHelper from "@/components/breadcrumb-helper";
import { checkBrand } from "../action";
import { redirect } from "next/navigation";
import ContentRenderer from "./_components/contentRenderer";

export default async function Page({
  params,
  searchParams,
}: {
  params: { brandid: string };
  searchParams: { id?: string; tab?: string };
}) {
  const brandSlug = params.brandid;
  const brandId = searchParams.id;
  const brandName = brandSlug.replace(/-/g, " ");

  const currentTab = searchParams.tab;
  const BreadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Manage Brands", href: "/manage-brands" },
    { name: `${brandName}`, href: '' },
  ];

  const { isBrandPresent, data } = await checkBrand(brandId!);

  if (!isBrandPresent) {
    redirect("/manage-brands");
  }
  // console.log(data)

  return (
    <div className="px-4">
      <BreadcrumbHelper triggerNeeded breadcrumbItems={BreadcrumbItems} />
      {data && (
        <ContentRenderer
          brandId={brandId as string}
          brandName={data.name}
          currentTab={currentTab as string}
          brandData={data}
        />
      )}
    </div>
  );
}
