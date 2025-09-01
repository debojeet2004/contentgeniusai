"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface ResetPasswordFormProps extends React.ComponentProps<"form"> {
  token: string;
}

export function ResetPasswordForm({
  className,
  token,
  ...props
}: ResetPasswordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token: token as string,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
    } else {
      toast.success("Password reset successfully");
      redirect("/login");
    }

    setIsLoading(false);
    toast.success("Your password has been reset successfully");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your new password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your new password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting Password..." : "Submit Password"}
          </Button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
      <div className="my-6 p-3 border border-yellow-400 rounded px-12 bg-yellow-50/50 dark:bg-yellow-900/10">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          🚧 Under development
        </p>
      </div>
    </Form>
  );
}

export default ResetPasswordForm;
