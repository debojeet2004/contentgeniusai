"use client"

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }else{
      toast.success("Password reset link has been sent to your email")
    }
    setIsLoading(false);
    
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={cn("flex flex-col gap-6", className)} 
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to reset your password
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="m@example.com" 
                    type="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending Email..." : "Reset Password"}
          </Button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Dont have an account? <Link href="/signup" className="text-primary">Sign Up</Link>
        </p>
      </div>
      <div className="my-6 p-3 border border-yellow-400 rounded px-12 bg-yellow-50/50 dark:bg-yellow-900/10">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          🚧 Under development, Domain is not Setup
        </p>
      </div>
    </Form>
  )
}
