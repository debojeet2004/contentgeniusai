"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralinfoForm from "./basicinfo/generalinfoForm";
import BrandIdentityForm from "./basicinfo/brandIdentityForm";
import { DangerZone } from "./danger/dangerZone";
import BrandAssets from "./brandAsset/asset";
import { useEffect, useState } from "react";
import { organization } from "@/db/schema/organization";

export default function ContentRenderer({
  brandId,
  brandName,
  currentTab,
  brandData,
}: {
  brandData: typeof organization.$inferSelect;
  brandId: string;
  currentTab: string,
  brandName: string;
}) {


  const [activeInfoTab, setActiveInfoTab] = useState("generalInfo");

  useEffect(() => {
    const savedTab = localStorage.getItem("activeInfoTab");
    if (savedTab) {
      setActiveInfoTab(savedTab);
    }
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case "brandInfo":
        return (
          <div className="flex-1 mt-4">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-5xl font-semibold tracking-tight">
                Brand Information
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Manage your brand&apos;s information, identity, and AI
                configurations. Update your brand details and fine-tune AI
                settings to ensure consistent communication across all channels.
              </p>
            </div>

            <Separator className="my-6" />

            {/* Main Tabs Section */}
            <Tabs
              defaultValue={activeInfoTab}
            //   value={activeInfoTab}
              onValueChange={(value) => {
                setActiveInfoTab(value);
                localStorage.setItem("activeInfoTab", value);
              }}
            >
              <div className="flex items-center justify-between w-full ">
                <TabsList className="bg-background border p-1 rounded shadow-sm h-11">
                  <TabsTrigger
                    value="generalInfo"
                    className="data-[state=active]:bg-accent data-[state=active]:text-primary-background data-[state=inactive]:text-stone-400 rounded h-8"
                  >
                    <span className="flex items-center gap-2">
                      General Information
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="brand-identity"
                    className="data-[state=active]:bg-accent data-[state=active]:text-primary-background data-[state=inactive]:text-stone-400 rounded h-8"
                  >
                    <span className="flex items-center gap-2">
                      Brand Identity & AI Configs
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <TabsContent value="generalInfo" className="mt-6">
                <GeneralinfoForm brandid={brandId!} brandData={brandData} />
              </TabsContent>

              <TabsContent value="brand-identity" className="mt-6">
                <BrandIdentityForm brandid={brandId!} brandData={brandData} />
              </TabsContent>
            </Tabs>
          </div>
        );
      case "brandAssets":
        return <BrandAssets brandId={brandId!} />;
      case "danger":
        return <DangerZone brandName={brandName!} brandId={brandId!} />;
      default:
        return null;
    }
  };

  return renderContent();
}
