"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import type { Programme } from "@/types/index";

interface ProgrammeCardProps {
  programme: Programme;
}

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{programme.category}</Badge>
          <Badge variant="secondary">{programme.level}</Badge>
        </div>
        <Link href={`/programmes/${programme.id}`}>
          <CardTitle className="text-lg leading-snug">{programme.title}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {programme.description}
        </p>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {programme.cost !== null ? `${programme.currency} ${programme.cost}` : "Price on request"}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{programme.mode}</span>
            <span>•</span>
            <span>{programme.duration}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
