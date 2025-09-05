"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const createBrandVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground gap-2",
        ghost: "w-full h-full justify-start gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const formSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBrandProps extends VariantProps<typeof createBrandVariants> {
  variant?: "default" | "ghost";
}

export default function CreateBrand({ variant = "default" }: CreateBrandProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsCreating(true);
    try {
      const slug = generateSlug(data.orgName);
      console.log("org Name:", data.orgName, "slug:", slug);

      const { error } = await authClient.organization.create({
        name: data.orgName as string,
        slug: slug as string,
        keepCurrentActiveOrganization: true,
      });

      if (error) {
        toast.error("Failed to create brand profile", {
          description: error.message,
        });
        form.setError("orgName", { message: error.message });
      } else {
        toast.success("Brand created successfully");
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to create brand profile",
      });
      setOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            createBrandVariants({ variant }),
            variant === "ghost" && "text-muted-foreground font-medium"
          )}
        >
          {variant === "ghost" ? (
            <>
              <div className="flex size-6 items-center justify-center rounded border bg-transparent">
                <Plus className="size-4" />
              </div>
              <span>Create Brand Profile</span>
            </>
          ) : (
            <>
              <Plus className="size-4" />
              <span>Create Brand Profile</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Brand Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orgName"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm text-gray-500">
                    Enter the name for your new brand profile
                  </Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
