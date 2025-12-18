"use client";

import React, { useState } from "react";
import {
  Sparkle,
  ChevronRight,
  Building2,
  Palette,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommonDetailsForm } from "./commonDetailsForm";
import { toast } from "sonner";
import { FinalDetailsForm } from "./finalDetailsForm";
import { createBlog } from "../action/createblog";
import { PersonaButton } from "./personaButton";

const blogTypes = [
  "Knowledge/Informative",
  "Creative/Storytelling",
  "Lifestyle/Experience",
  "Opinion/Commentary",
] as const;

const commondefaultFormData = {
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
};

const finaldefaultFormData = {
  tags: [],
  description: "",
};

export function CreateBlog() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [persona, setPersona] = useState<"casual" | "brand" | null>(null);
  const [selectedType, setSelectedType] = useState("");

  const [commonFormData, setCommonFormData] = useState(commondefaultFormData);
  const [FinalFromData, setFinalFromData] = useState(finaldefaultFormData);
  const [isloading, setIsloading] = useState(false);

  // Reset state when the dialog closes
  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep(1);
      setSelectedType("");
      setPersona(null);
      setCommonFormData(commondefaultFormData);
      setFinalFromData(finaldefaultFormData);
    }
  };

  const handlePersonaSelect = (p: "casual" | "brand") => {
    setPersona(p);
    setStep(2);
  };

  const onCommonFormNext = (data: any) => {
    setCommonFormData(data);
    setStep(4);
  };

  const onFinalFormPrevious = (data: any) => {
    setFinalFromData(data);
    setStep(3);
  };

  const onSubmit = async (finalDetailsData: any) => {
    console.log("finalDetailsData:", finalDetailsData);
    setIsloading(true);

    if (!persona || !selectedType) {
      console.error(
        "Critical State Error: Persona or Content Type is missing on submit."
      );
      toast.error("An error occurred. Please restart the form.");
      setIsloading(false);
      return;
    }

    const combinedFormData = {
      ...commonFormData,
      ...finalDetailsData,
    };

    const finalPayload = {
      persona: persona as "casual" | "brand",
      contentType: selectedType as
        | "Knowledge/Informative"
        | "Creative/Storytelling"
        | "Lifestyle/Experience"
        | "Opinion/Commentary",
      commonFormData: combinedFormData,
    };

    console.log("Final Payload:", finalPayload);

    try {
      const result = await createBlog(finalPayload);

      if (result?.success) {
        toast.success(result.message || "Blog created successfully!");
        setStep(1);
        setCommonFormData(commondefaultFormData);
        setSelectedType("");
        setIsOpen(false);
      } else {
        toast.error(result?.message || "Failed to create blog.");
        console.error(result?.message);
      }
    } catch (err: any) {
      console.error("CreateBlog Error:", err);
      toast.error("Unexpected error occurred. Please try again.");
      setIsloading(false);
    } finally {
      setIsloading(false);
    }
  };

  const personaOptions = [
    {
      id: "brand",
      title: "Brand Driven",
      description:
        "Write for your active brand profile and ensure consistency.",
      icon: Building2,
    },
    {
      id: "casual",
      title: "Casual Creativity",
      description: "Write a quick, one-off blog without brand context.",
      icon: Palette,
    },
  ] as const;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader className="text-left">
              <DialogTitle>Who are you writing for?</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Select the persona that best represents your writing style.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {personaOptions.map((option) => (
                <PersonaButton
                  key={option.id}
                  {...option}
                  onClick={handlePersonaSelect}
                  isSelected={persona === option.id} 
                />
              ))}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <DialogHeader className="text-left">
              <DialogTitle>Choose your blog type</DialogTitle>
              <p className="text-sm text-gray-500">
                Select the type of blog that best fits your content.
              </p>
            </DialogHeader>
            <div className="pt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedType || "Select a blog type..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[25rem]">
                  {blogTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() => setSelectedType(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button onClick={() => setStep(3)} disabled={!selectedType}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-semibold">
                Provide Blog Details and Metadata
              </DialogTitle>
              <DialogDescription className="text-xs">
                Fill in the essential details about your blog post to help the
                agent <br /> curate effectively and understand your content.
              </DialogDescription>
            </DialogHeader>
            <CommonDetailsForm
              onNext={onCommonFormNext}
              onPrevious={() => setStep(2)}
              initialData={commonFormData}
            />
          </>
        );

      case 4:
        return (
          <>
            <DialogHeader className="text-left">
              <DialogTitle>Few more details </DialogTitle>
              <DialogDescription className="text-xs">
                Add the description and tags for your blog post before
                submitting.
              </DialogDescription>
            </DialogHeader>
            <FinalDetailsForm
              onPrevious={onFinalFormPrevious}
              onSubmit={onSubmit}
              isLoading={isloading}
              initialData={FinalFromData}
            />
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant={"default"} onClick={() => setIsOpen(true)}>
          <Sparkle className="h-4 w-4 mr-2" />
          Show Your Creativity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">{renderStep()}</DialogContent>
    </Dialog>
  );
}
