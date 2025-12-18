// @/app/(dashboard)/_components/blog-creation/common-details-form.tsx

"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronsUpDown, List, X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const targetAudienceTypes = [
  "general",
  "student",
  "b2b",
  "b2c",
  "freelancer_creator",
] as const;

const voiceToneTypes = [
  "formal",
  "casual",
  "concise",
  "elaborative",
  "playful",
  "empathetic",
  "inspiring",
  "sarcastic",
] as const;

const wordCountRanges = [
  "500-1000 words",
  "1000-1500 words",
  "1500-2000 words",
  "2000+ words",
] as const;

// Define the Zod schema for common fields
export const commonFormSchema = z.object({
  topic: z.string().min(1, { message: "Topic is required." }),
  field: z.string().min(1, { message: "Field is required." }),
  targetAudience: z.array(z.enum(targetAudienceTypes)).optional(),
  userGoal: z.array(z.string()).optional(),
  searchIntent: z.array(z.string()).optional(),
  usp: z.array(z.string()).optional(),
  tone: z.array(z.enum(voiceToneTypes)).optional(),
  formattingNotes: z.array(z.string()).optional(),
  wordCountRange: z.enum(wordCountRanges).optional(),
  callToActions: z.array(z.string()).optional(),
  imagePrompts: z.array(z.string()).optional(),
});

type CommonDetailsFormValues = z.infer<typeof commonFormSchema>;

interface CommonDetailsFormProps {
  onNext: (data: CommonDetailsFormValues) => void;
  onPrevious: () => void;
  initialData?: any;
}

// Reusable Multi-Select Dropdown component
const MultiSelectDropdown = ({
  field,
  options,
  placeholder,
}: {
  field: any;
  options: readonly string[];
  placeholder: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {field.value?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {field.value.map((item: string) => (
                <Badge key={item} variant="secondary" className="text-[8px]">
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[12rem]">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={field.value?.includes(option)}
            onCheckedChange={(checked) => {
              // Check current selections and if already selected
              const currentCount = field.value?.length || 0;
              const isAlreadySelected = field.value?.includes(option);

              // Show toast if trying to select more than 2 items
              if (checked && currentCount >= 2 && !isAlreadySelected) {
                toast("You can only select up to 2 items");
                return;
              }

              // Update the field value
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

// Custom component for handling array inputs with tags
export const ArrayInput = ({
  field,
  placeholder,
}: {
  field: any;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const itemsCount = field.value?.length || 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();

      if (trimmedValue !== "") {
        // Check if the item already exists in the array
        if (field.value?.includes(trimmedValue)) {
          toast("This item already exists.");
          setInputValue("");
          return;
        }

        const newValues = [...(field.value || []), trimmedValue];
        field.onChange(newValues);
        setInputValue("");
      }
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = field.value?.filter((v: string) => v !== valueToRemove);
    field.onChange(newValues);
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {itemsCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <Dialog>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>View all {itemsCount} items</p>
              </TooltipContent>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>All Items</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[200px] py-4 pr-4">
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((item: string) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="flex items-center gap-1.5"
                      >
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-3 w-3 p-0 hover:bg-transparent"
                          onClick={() => handleRemove(item)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export function CommonDetailsForm({
  onNext,
  onPrevious,
  initialData,
}: CommonDetailsFormProps) {
  const form = useForm<CommonDetailsFormValues>({
    resolver: zodResolver(commonFormSchema),
    defaultValues: initialData || {
      topic: "",
      field: "",
      targetAudience: [],
      userGoal: [],
      searchIntent: [],
      usp: [],
      tone: [],
      formattingNotes: [],
      wordCountRange: undefined,
      callToActions: [],
      imagePrompts: [],
    },
  });

  function onSubmit(values: CommonDetailsFormValues) {
    onNext(values);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
          }
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., The future of AI" />
                </FormControl>
                <FormMessage className="text-xs ital" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Technology, Finance" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <MultiSelectDropdown
                  field={field}
                  options={targetAudienceTypes}
                  placeholder="Select audiences..."
                />
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Goal</FormLabel>
                <FormControl>
                  <ArrayInput
                    field={field}
                    placeholder="e.g., Get new signups"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="searchIntent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Intent</FormLabel>
                <FormControl>
                  <ArrayInput
                    field={field}
                    placeholder="e.g., informational"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Selling Proposition</FormLabel>
                <FormControl>
                  <ArrayInput
                    field={field}
                    placeholder="e.g., Fast delivery"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice Tone</FormLabel>
                <MultiSelectDropdown
                  field={field}
                  options={voiceToneTypes}
                  placeholder="Select tones..."
                />
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formattingNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formatting Notes</FormLabel>
                <FormControl>
                  <ArrayInput
                    field={field}
                    placeholder="e.g., Use bullet points"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="wordCountRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Word Count Range</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {field.value || "Select a range..."}
                      <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[12rem]">
                    {wordCountRanges.map((range) => (
                      <DropdownMenuItem
                        key={range}
                        onSelect={() => field.onChange(range)}
                      >
                        {range}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="callToActions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call to Action</FormLabel>
                <FormControl>
                  <ArrayInput
                    field={field}
                    placeholder="e.g., Subscribe now"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imagePrompts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Prompts</FormLabel>
              <FormControl>
                {/* <Textarea
                  {...field}
                  placeholder=""
                  
                /> */}
                <ArrayInput
                    field={field}
                    placeholder="e.g., A minimalist graphic of a robot working with a cat"
                  />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-4">
          <Button variant="outline" type="button" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
