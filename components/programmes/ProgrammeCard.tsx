"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import type { Programme } from "@/types/index";
import { Check, CheckCircle2, Plus } from "lucide-react";

interface ProgrammeCardProps {
  programme: Programme;
  onCompareToggle?: (programme: Programme) => void;
  isCompared?: boolean;
  showCompare?: boolean;
}

export function ProgrammeCard({ programme, onCompareToggle, isCompared = false, showCompare = false }: ProgrammeCardProps) {
  const formatCost = (cost: number | null, currency: string | null) => {
    if (!cost) return "Price on request";
    const symbols: Record<string, string> = { GBP: "£", USD: "$", EUR: "€" };
    return `${symbols[currency || "GBP"] || currency}${cost.toLocaleString()}`;
  };

  const modeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    online: { label: "Online", icon: <span className="h-3.5 w-3.5">🌐</span> },
    "in-person": { label: "In-person", icon: <span className="h-3.5 w-3.5">🏢</span> },
    hybrid: { label: "Hybrid", icon: <span className="h-3.5 w-3.5">🔄</span> },
  };

  const modeInfo = modeLabels[programme.mode || ""] || { label: programme.mode || "—", icon: null };

  return (
    <Card variant="interactive" className="h-full flex flex-col">
      <Link href={`/programmes/${programme.id}`} className="block">
        <div className="relative aspect-video rounded-t-xl overflow-hidden bg-surface">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex gap-1.5">
              <Badge variant="outline" className="text-xs">{programme.category}</Badge>
              <Badge variant="secondary" className="text-xs">{programme.level}</Badge>
            </div>
            {showCompare && onCompareToggle && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompareToggle(programme); }}
                className={`
                  rounded-full p-1.5 transition-all duration-200
                  ${isCompared ? "bg-primary text-primary-foreground" : "bg-black/50 text-white hover:bg-white/20"}
                `}
                aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
                aria-pressed={isCompared}
              >
                {isCompared ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
        <CardContent className="pt-4 pb-2 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {programme.title}
          </h3>
          <p className="text-sm text-foreground-muted line-clamp-3 mb-4 flex-1">
            {programme.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-foreground-muted">
            {modeInfo.icon && <span className="flex items-center gap-1">{modeInfo.icon} {modeInfo.label}</span>}
            <span>•</span>
            <span>{programme.duration}</span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {formatCost(programme.cost, programme.currency)}
          </span>
          {programme.provider && (
            <span className="text-xs text-foreground-muted truncate max-w-[120px]">
              {programme.provider.name}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export function ProgrammeCardSkeleton() {
  return (
    <Card variant="default">
      <div className="aspect-video rounded-t-xl bg-muted animate-pulse" />
      <CardContent className="pt-4 pb-2 space-y-3">
        <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
      </CardContent>
      <CardFooter className="pt-2 border-t border-border/50">
        <div className="flex justify-between">
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}