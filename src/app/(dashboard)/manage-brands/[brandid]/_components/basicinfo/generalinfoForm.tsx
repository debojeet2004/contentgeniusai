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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { organization } from "@/db/schema";
import { updateGeneralInfo } from "../../action";

export type IndustryType = (typeof industryTypes)[number];
export type TargetAudienceType = (typeof targetAudienceTypes)[number];
export type VoiceToneType = (typeof voiceToneTypes)[number];

export const industryTypes = [
  "technology",
  "healthcare",
  "finance",
  "education",
  "entertainment",
  "e-commerce",
  "creative",
  "food_beverage",
  "real_estate",
  "non_profit",
  "marketing_advertising",
  "fitness_wellness",
  "travel_hospitality",
  "legal",
] as const;

export const targetAudienceTypes = [
  "general",
  "student",
  "b2b",
  "b2c",
  "freelancer_creator",
] as const;

export const voiceToneTypes = [
  "formal",
  "casual",
  "concise",
  "elaborative",
  "playful",
  "empathetic",
  "inspiring",
  "sarcastic",
] as const;

// Define the Zod schema based on your database table
export const generalInfoFromSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Brand Name must be at least 4 characters." }),
  slug: z.string().min(4, { message: "Slug must be at least 4 characters." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
  brandmission: z.array(z.string()).optional(),
  industry: z.array(z.enum(industryTypes)).optional(),
  targetaudience: z.array(z.enum(targetAudienceTypes)).optional(),
  voicetone: z.array(z.enum(voiceToneTypes)).optional(),
  uniqsellingpoints: z.array(z.string()).optional(),
  competitor: z.array(z.string()).optional(),
  logo: z.string().optional(),
});

type GeneralInfoFormValues = z.infer<typeof generalInfoFromSchema>;

export default function GeneralInfoForm({
  brandid,
  brandData,
}: {
  brandid: string;
  brandData: typeof organization.$inferSelect;
}) {
  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoFromSchema),
    defaultValues: {
      name: brandData?.name ?? "",
      slug: brandData?.slug ?? "",
      description: brandData?.description ?? "",
      brandmission: brandData?.brandmission ?? [],
      industry: brandData?.industry ?? [],
      targetaudience: brandData?.targetaudience ?? [],
      voicetone: brandData?.voicetone ?? [],
      uniqsellingpoints: brandData?.uniqsellingpoints ?? [],
      competitor: brandData?.competitor ?? [],
      logo: brandData?.logo ?? "",
    },
  });

  const [isloading , setisloading] = useState(false);

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

  const MultiSelectDropdown = ({
    field,
    options,
    placeholder,
  }: {
    field: any;
    options: readonly string[];
    placeholder: string;
  }) => {
    const maxSelections = 3;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>{placeholder}</span>
            <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={field.value?.includes(option)}
              onCheckedChange={(checked) => {
                if (checked && (field.value?.length || 0) >= maxSelections) {
                  toast.warning(
                    `You can select a maximum of ${maxSelections} options.`
                  );
                  return;
                }
                const newValues = checked
                  ? [...(field.value || []), option]
                  : field.value?.filter((val: string) => val !== option);
                field.onChange(newValues);
              }}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MultiSelectBadgeDisplay = ({ field }: { field: any }) =>
    field.value?.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-2">
        {field.value.map((item: string, index: number) => (
          <Badge
            key={`${item}-${index}`}
            variant="secondary"
            className="font-normal"
          >
            {item}
          </Badge>
        ))}
      </div>
    );

  async function onSubmit(values: GeneralInfoFormValues) {
    try {
      setisloading(true);
      const result = await updateGeneralInfo({
        brandId: brandid,
        data: values,
      });

      if (result.success) {
        setisloading(false);
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to update brand information.");
      }
    } catch (error) {
      setisloading(false);
      toast.error("An unexpected error occurred.");
      console.error(error);
    }
  }

  return (
    <div className="rounded-lg w-full bg-background mt-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.target as HTMLElement).tagName !== "TEXTAREA"
            ) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-fit mr-6 mb-6">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Logo</FormLabel>
                    <FormControl>
                      <div className="space-y-2 mt-2">
                        <div className="relative w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:bg-muted/50 transition-colors">
                          {field.value ? (
                            <img
                              src={field.value}
                              alt="Logo preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Plus className="h-12 w-12 text-gray-400" />
                              <span className="text-sm text-muted-foreground">
                                Click to upload
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] italic max-w-42 text-muted-foreground ">
                          Recommended: Square image (1:1 ratio), minimum
                          400x400px Formats: JPG, PNG. Max size: 2MB
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-6xl space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., ContentGenius AI"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., content-genius-ai"
                          disabled // The slug is disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="A brief description of your brand..."
                        rows={3}
                        className="min-h-[10rem] max-h-[16rem]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Mission</FormLabel>
                    <FormControl>
                      <ArrayInput
                        field={field}
                        placeholder="e.g., Build tools for creators"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <MultiSelectBadgeDisplay field={field} />
                      <MultiSelectDropdown
                        field={field}
                        options={industryTypes}
                        placeholder="Select industries..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetaudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <MultiSelectBadgeDisplay field={field} />
                      <MultiSelectDropdown
                        field={field}
                        options={targetAudienceTypes}
                        placeholder="Select audiences..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="voicetone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Tone</FormLabel>
                      <MultiSelectBadgeDisplay field={field} />
                      <MultiSelectDropdown
                        field={field}
                        options={voiceToneTypes}
                        placeholder="Select tones..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="uniqsellingpoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique Selling Points</FormLabel>
                      <FormControl>
                        <ArrayInput
                          field={field}
                          placeholder="e.g., AI-powered market analysis"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Links</FormLabel>
                      <FormControl>
                        <ArrayInput
                          field={field}
                          placeholder="e.g., https://buffer.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-start">
                <Button type="submit" className="w-[10rem]">
                  {isloading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
