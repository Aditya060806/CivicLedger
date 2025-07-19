import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "card" | "text" | "avatar" | "chart" | "button";
  count?: number;
}

export const SkeletonLoader = ({ 
  className, 
  variant = "text", 
  count = 1 
}: SkeletonLoaderProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className={cn(getSkeletonClasses(variant), className)}>
      <div className="animate-shimmer h-full w-full" />
    </div>
  ));

  return <>{skeletons}</>;
};

function getSkeletonClasses(variant: string): string {
  switch (variant) {
    case "card":
      return "h-48 w-full rounded-lg bg-civic-gray-100";
    case "avatar":
      return "h-12 w-12 rounded-full bg-civic-gray-100";
    case "chart":
      return "h-64 w-full rounded-lg bg-civic-gray-100";
    case "button":
      return "h-10 w-24 rounded-lg bg-civic-gray-100";
    default:
      return "h-4 w-full rounded bg-civic-gray-100";
  }
}

export const CardSkeleton = () => (
  <div className="enhanced-card p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <SkeletonLoader variant="avatar" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonLoader variant="chart" />
    <div className="flex space-x-2">
      <SkeletonLoader variant="button" />
      <SkeletonLoader variant="button" />
    </div>
  </div>
);

export const ListSkeleton = ({ items = 5 }: { items?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 enhanced-card">
        <SkeletonLoader variant="avatar" />
        <div className="space-y-2 flex-1">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-3 w-2/3" />
        </div>
        <SkeletonLoader variant="button" />
      </div>
    ))}
  </div>
);