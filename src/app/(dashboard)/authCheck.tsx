"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LoaderOne } from "@/components/ui/loader";

export function AuthCheck({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoaderOne />
      </div>
    );
  }
  if (!session) {
    redirect("/login");
  };
  return (
    <>
      {children}
    </>
  );
}
