import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";


interface AuthenticationButtonProps {
  provider: string;
}

export default function SocialAuthButton({
  provider,
}: AuthenticationButtonProps) {
  // const router = useRouter();

  const getIcon = () => {
    switch (provider) {
      case "github":
        return <FaGithub className="w-5 h-5" />;
      case "google":
        return <FcGoogle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleSocialSignin = async (provider: string) => {
    await authClient.signIn.social({
      provider: provider as "github" | "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/login",
    });
  };

  return (
    <Button
      type="button"
      onClick={() => handleSocialSignin(provider)}
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      {getIcon()}
      <span>
        Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </span>
    </Button>
  );
}
