import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Zod schema for the final details form
const finalDetailsSchema = z.object({
  tags: z.array(z.string()).optional(),
  description: z
    .string()
    .min(15, { message: "description is required for better output." }),
});

type FinalDetailsFormValues = z.infer<typeof finalDetailsSchema>;

interface FinalDetailsFormProps {
  onPrevious: (data: FinalDetailsFormValues) => void;
  onSubmit: (data: FinalDetailsFormValues) => void;
  isLoading: boolean;
  initialData?: any;
}

export function FinalDetailsForm({
  isLoading,
  onPrevious,
  onSubmit,
  initialData,
}: FinalDetailsFormProps) {
  const form = useForm<FinalDetailsFormValues>({
    resolver: zodResolver(finalDetailsSchema),
    defaultValues: initialData || {
      tags: [],
      description: "",
    },
  });

  const handleSubmit = (values: FinalDetailsFormValues) => {
    onSubmit(values);
  };

  const handlePreviousClick = () => {
    const currentData = form.getValues();
    onPrevious(currentData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <ArrayInput
                  field={field}
                  placeholder="e.g., ai, marketing, saas"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter a brief description for your blog..."
                  rows={3}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="flex justify-between mt-4">
          <Button variant="outline" type="button" onClick={handlePreviousClick}>
            Previous
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-24">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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
