/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organization } from "@/db/schema";
import { updateBrandIdentity } from "../../action";

// Re-using the logic from General Info Form
const ArrayInput = ({
  field,
  placeholder,
}: {
  field: any;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const maxDisplayedItems = 4;
  const itemsToDisplay = field.value?.slice(0, maxDisplayedItems) || [];
  const remainingItemsCount = (field.value?.length || 0) - maxDisplayedItems;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue === "") {
        return;
      }
      if (field.value?.includes(trimmedValue)) {
        toast.warning("This item has already been added.");
        setInputValue("");
        return;
      }

      const newValues = [...(field.value || []), trimmedValue];
      field.onChange(newValues);
      setInputValue("");
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = field.value?.filter((v: string) => v !== valueToRemove);
    field.onChange(newValues);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {itemsToDisplay.map((item: string, index: number) => (
          <Badge
            key={`${item}-${index}`}
            variant="secondary"
            className="flex items-center gap-1.5"
          >
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="h-3 w-3 p-0"
              onClick={() => handleRemove(item)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {remainingItemsCount > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7">
                Show all ({remainingItemsCount})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>All Items</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="flex flex-wrap gap-2 py-4">
                  {field.value.map((item: string, index: number) => (
                    <Badge
                      key={`${item}-${index}`}
                      variant="secondary"
                      className="flex items-center gap-1.5"
                    >
                      {item}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 p-0"
                        onClick={() => handleRemove(item)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

// Custom component for the visual color picker
const ColorPicker = ({ field }: { field: any }) => (
  <div className="flex items-center space-x-2">
    <Input
      type="color"
      value={field.value || "#000000"}
      onChange={field.onChange}
      className="h-10 w-10 p-0 cursor-pointer [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
    />
    <Input
      placeholder="#000000"
      value={field.value || ""}
      onChange={field.onChange}
    />
  </div>
);

// Zod schemas for nested data structures
const VisualIdentitySchema = z
  .object({
    color_palette: z
      .object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        accent: z.string().optional(),
      })
      .optional(),
    typography: z
      .object({
        heading: z.string().optional(),
        body: z.string().optional(),
      })
      .optional(),
    image_style: z.array(z.string()).optional(),
  })
  .optional();

const ContentAndMessagingSchema = z
  .object({
    brand_values: z.array(z.string()).optional(),
    messaging_pillars: z.array(z.string()).optional(),
    grammar_rules: z
      .object({
        oxford_comma: z.enum(["always", "never"]).optional(),
        exclamation_points: z.enum(["use", "do not use"]).optional(),
      })
      .optional(),
    language_guidelines: z
      .object({
        do_use: z.array(z.string()).optional(),
        do_not_use: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .optional();

// Main Zod schema
export const brandIdentityFormSchema = z.object({
  visual_identity: VisualIdentitySchema,
  content_and_messaging: ContentAndMessagingSchema,
});

type BrandIdentityFormValues = z.infer<typeof brandIdentityFormSchema>;

export default function BrandIdentityForm({ brandid, brandData }: { brandid: string, brandData: typeof organization.$inferSelect }) {
  const form = useForm<BrandIdentityFormValues>({
    resolver: zodResolver(brandIdentityFormSchema),
    defaultValues: {
      visual_identity: (brandData?.brandmetadata as any)?.visual_identity ?? {
        color_palette: {},
        typography: {},
        image_style: [],
      },
      content_and_messaging: (brandData?.brandmetadata as any)?.content_and_messaging ?? {
        brand_values: [],
        messaging_pillars: [],
        grammar_rules: {
          oxford_comma: 'always',
          exclamation_points: 'use'
        },
        language_guidelines: {
          do_use: [],
          do_not_use: [],
        },
      },
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: BrandIdentityFormValues) {
    try {
      setIsLoading(true);
      const result = await updateBrandIdentity({
        brandId: brandid,
        data: values,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to update brand identity.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg w-[85rem] bg-background ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.target as HTMLElement).tagName !== "TEXTAREA"
            ) {
              e.preventDefault();
            }
          }}
        >
          {/* Visual Identity Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Visual Identity</h2>
            <p className="text-sm text-muted-foreground">
              Define your brand&apos;s visual style and feel.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Color Palette */}
              <div className="md:col-span-1 space-y-4">
                <FormLabel>Color Palette</FormLabel>
                <FormField
                  control={form.control}
                  name="visual_identity.color_palette.primary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary</FormLabel>
                      <FormControl>
                        <ColorPicker field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visual_identity.color_palette.secondary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary</FormLabel>
                      <FormControl>
                        <ColorPicker field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visual_identity.color_palette.accent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent</FormLabel>
                      <FormControl>
                        <ColorPicker field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Typography */}
              <div className="md:col-span-1 space-y-4">
                <FormLabel>Typography</FormLabel>
                <FormField
                  control={form.control}
                  name="visual_identity.typography.heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading Font</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Poppins" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visual_identity.typography.body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Font</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Inter" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Style */}
              <div className="md:col-span-1 space-y-4">
                <FormLabel>Image Style</FormLabel>
                <FormField
                  control={form.control}
                  name="visual_identity.image_style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <ArrayInput
                          field={field}
                          placeholder="e.g., warm, minimalistic, professional"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Content & Messaging Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Content & Messaging</h2>
            <p className="text-sm text-muted-foreground">
              Define your brand&apos;s voice, tone, and grammar rules.
            </p>

            {/* Brand Values and Messaging Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="content_and_messaging.brand_values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Values</FormLabel>
                    <FormControl>
                      <ArrayInput
                        field={field}
                        placeholder="e.g., Authenticity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content_and_messaging.messaging_pillars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Messaging Pillars</FormLabel>
                    <FormControl>
                      <ArrayInput
                        field={field}
                        placeholder="e.g., Sustainability"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Grammar Rules and Language Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grammar Rules Section */}
              <div className="space-y-4">
                <FormLabel>Grammar Rules</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="content_and_messaging.grammar_rules.oxford_comma"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oxford Comma</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a rule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="always">Always</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_and_messaging.grammar_rules.exclamation_points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exclamation Points</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a rule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="use">Use</SelectItem>
                              <SelectItem value="do not use">
                                Do Not Use
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Language Guidelines Section */}
              <div className="space-y-4">
                <FormLabel>Language Guidelines</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="content_and_messaging.language_guidelines.do_use"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do Use</FormLabel>
                        <FormControl>
                          <ArrayInput
                            field={field}
                            placeholder="e.g., 'Utilize'"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_and_messaging.language_guidelines.do_not_use"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do Not Use</FormLabel>
                        <FormControl>
                          <ArrayInput
                            field={field}
                            placeholder="e.g., 'Leverage'"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            {isLoading ? "Saving Identity..." : "Save Identity"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
