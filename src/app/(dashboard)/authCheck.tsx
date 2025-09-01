"use client";

import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export function AuthCheck({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="flex gap-2">
          <Loader2 className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2" />
          Loading...
        </p>
      </div>
    );
  }

  if (!session) {
    // Redirect if there is no session
    redirect("/login");
  }

  // If there is a session, render the children
  return <>{children}</>;
}
