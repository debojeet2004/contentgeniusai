
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "../_components/forgotPassForm";

export default async function ForgotPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative flex flex-col items-center justify-center p-6 md:p-10">
        <Link 
          href="/login" 
          className="absolute left-6 top-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
        <ForgotPasswordForm className="mx-auto min-w-[40%]" />
      </div>
      <div className="bg-muted relative hidden lg:block">
        {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
