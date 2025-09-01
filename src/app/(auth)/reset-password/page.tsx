import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResetPasswordForm from "../_components/resetpassForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  console.log(token);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative flex flex-col items-center justify-center p-6 md:p-10">
        <Link
          href="/login"
          className="absolute left-6 top-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
        <ResetPasswordForm
          className="mx-auto min-w-[40%]"
          token={token || ""}
        />
      </div>
      <div className="bg-muted relative hidden lg:block"></div>
    </div>
  );
}
