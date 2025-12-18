"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { Building2, Palette } from "lucide-react";

interface PersonaButtonProps {
  id: "brand" | "casual";
  title: string;
  description: string;
  icon: typeof Building2 | typeof Palette;
  onClick: (id: "brand" | "casual") => void;
  isSelected: boolean;
}

export const PersonaButton: React.FC<PersonaButtonProps> = ({
  id,
  title,
  description,
  icon: Icon,
  onClick,
  isSelected,
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full h-auto py-6 transition-all duration-200 group flex justify-start items-center relative",
        "hover:border-primary/50 hover:bg-muted/30",
        {
          "border-yellow-400 border-2 shadow-xl bg-yellow-50 dark:bg-yellow-900/10 scale-[1.01]": isSelected,
        }
      )}
      onClick={() => onClick(id)}
    >
      <div className="flex flex-col items-start gap-1">
        <Icon 
          className={cn(
            "h-5 w-5 mb-1 transition-colors duration-200",
            isSelected ? "text-yellow-500 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300 group-hover:text-primary"
          )}
        />
        
        <h3 
          className={cn(
            "text-base font-semibold transition-colors duration-200",
            isSelected ? "text-yellow-700 dark:text-yellow-300" : "text-gray-900 dark:text-gray-100"
          )}
        >
          {title}
        </h3>
        
        <p 
          className={cn(
            "text-sm text-gray-500 text-left transition-colors duration-200",
            isSelected ? "text-yellow-600 dark:text-yellow-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {description}
        </p>
      </div>
    </Button>
  );
};