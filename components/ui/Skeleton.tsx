"use client";

import * as React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", width, height, lines = 3, ...props }, ref) => {
    const baseStyles = "rounded bg-muted animate-pulse";

    const variantStyles = {
      text: "h-4 w-full",
      circular: "rounded-full",
      rectangular: "rounded-lg",
    };

    if (variant === "text" && lines > 1) {
      return (
        <div ref={ref} className={["space-y-2", className].filter(Boolean).join(" ")} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={[
                baseStyles,
                variantStyles.text,
                i === lines - 1 && "w-3/4",
                width && `max-w-[${typeof width === "number" ? `${width}px` : width}]`,
              ].filter(Boolean).join(" ")}
              style={{ width: i === lines - 1 ? (width ? (typeof width === "number" ? `${width * 0.75}px` : `calc(${width} * 0.75)`) : "75%") : width }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={[
          baseStyles,
          variantStyles[variant],
          className,
        ].filter(Boolean).join(" ")}
        style={{
          width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
          height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangular" className="aspect-video" />
      <div className="space-y-2 px-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

export function ProgrammeCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangular" className="aspect-video rounded-t-xl" />
      <div className="px-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton variant="circular" className="h-5 w-20" />
          <Skeleton variant="circular" className="h-5 w-16" />
        </div>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" lines={2} />
      </div>
      <div className="px-4 pb-4 flex items-center justify-between">
        <Skeleton variant="text" width="25%" />
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="h-4 w-12" />
          <Skeleton variant="circular" className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton(columns = 4) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" height="1rem" />
      ))}
    </div>
  );
}