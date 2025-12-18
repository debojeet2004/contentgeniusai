"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CalendarIcon, Loader2, SparklesIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface BlogCardType {
  id: string;
  brandName: string;
  status: "pending" | "draft" | "published";
  contentType: string;
  createdAt: Date;
  inputMetadata: {
    topic: string;
    description: string;
  };
  tags: string[];
}

const brandColors = [
  "dark:from-purple-900/20 dark:to-pink-900/20 from-purple-100 to-pink-100 border-purple-200 dark:border-purple-800",
  "dark:from-blue-900/20 dark:to-cyan-900/20 from-blue-100 to-cyan-100 border-blue-200 dark:border-blue-800",
  "dark:from-green-900/20 dark:to-emerald-900/20 from-green-100 to-emerald-100 border-green-200 dark:border-green-800",
  "dark:from-orange-900/20 dark:to-yellow-900/20 from-orange-100 to-yellow-100 border-orange-200 dark:border-orange-800",
  "dark:from-pink-900/20 dark:to-rose-900/20 from-pink-100 to-rose-100 border-pink-200 dark:border-pink-800",
  "dark:from-indigo-900/20 dark:to-purple-900/20 from-indigo-100 to-purple-100 border-indigo-200 dark:border-indigo-800",
];

export function BlogCard({
  blog,
  className,
}: {
  blog: BlogCardType;
  className?: string;
}) {
  const brandColorIndex = blog.id.length % brandColors.length;
  const gradientClass = brandColors[brandColorIndex];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Generating",
          color:
            "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800",
          icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
        };
      case "draft":
        return {
          text: "Generated / Draft",
          color:
            "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
          icon: null,
        };
      case "published":
        return {
          text: "Published",
          color:
            "bg-sky-100 text-sky-800 dark:bg-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-800",
          icon: null,
        };
      default:
        return {
          text: status,
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800",
          icon: null,
        };
    }
  };

  const statusBadge = getStatusBadge(blog.status);
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`#`}
      passHref
    >
      <div
        className={cn(
          "min-h-[15rem] rounded-2xl shadow-sm border border-transparent transition-all duration-300 group bg-gradient-to-br p-3 py-8 hover:scale-[1.02] relative overflow-hidden",
          className,
          gradientClass,
          {
            "hover:shadow-md hover:border-opacity-50": true,
          }
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:from-transparent dark:via-gray-800/5 dark:to-gray-800/10" />
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:from-transparent dark:via-gray-800/10 dark:to-transparent blur-xl opacity-50" />
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-tl from-current/5 to-transparent rounded-full blur-2xl" />
        <div className="absolute left-0 top-0 w-24 h-24 bg-gradient-to-br from-current/5 to-transparent rounded-full blur-xl" />
        <div className="relative"></div>
        {/* Header with content type and status */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary" 
              className="bg-white/90 dark:bg-gray-800/90 
                text-gray-700 dark:text-gray-300 
                px-3 py-1 rounded-md
                border border-gray-200 dark:border-gray-700
                shadow-sm"
            >
              {blog.contentType}
            </Badge>
          </div>
          <Badge
            className={cn(`${statusBadge.color} font-medium text-xs px-2 py-1`)}
          >
            {statusBadge.icon} {statusBadge.text}
          </Badge>
        </div>

        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {blog.inputMetadata.topic}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed truncate w-[90%]">
            {blog.inputMetadata.description || "No description provided."}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {blog.tags.slice(0, 4).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/80 dark:bg-gray-800/80 
                text-gray-700 dark:text-gray-300 
                border border-gray-200/50 dark:border-gray-700/50 
                text-xs px-3 py-1 font-medium
                hover:bg-gray-100 dark:hover:bg-gray-700/90
                transition-colors duration-200
                rounded-full shadow-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Created At */}
        <div className="mt-8 flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="inline-block w-3 h-3 mr-1" />
            {formattedDate} 
            <span className="mx-2">•</span>
            <SparklesIcon className="inline-block w-3 h-3 mr-1" />
            Crafted with creativity
          </span>
        </div>
      </div>
    </Link>
  );
}
