"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { listSavedProgrammes, unsaveProgramme } from "@/lib/api/programmesApi";
import type { Programme } from "@/types/index";
import { ProgrammeCard } from "@/components/programmes/ProgrammeCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export default function SavedPage() {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await listSavedProgrammes();
      if (err) throw new Error(err.message);
      setProgrammes(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load saved programmes.");
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnsave = async (id: string) => {
    try {
      const { error: err } = await unsaveProgramme(id);
      if (err) throw new Error(err.message);
      setProgrammes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unsave programme.");
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchSaved();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [fetchSaved]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading saved programmes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Saved Programmes</h1>
            <p className="text-muted-foreground">
              Programmes you&apos;ve saved for later
            </p>
          </div>
          <Link href="/programmes" className="text-sm font-medium text-primary hover:underline">
            Browse more programmes &rarr;
          </Link>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="container mx-auto">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/50 p-4 text-sm text-destructive mb-6">
              {error}
            </div>
          )}

          {programmes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                You haven&apos;t saved any programmes yet.
              </p>
              <Link href="/programmes">
                <Button>Browse programmes</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {programmes.map((prog) => (
                <Card key={prog.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs border border-input rounded-full px-2 py-0.5 text-muted-foreground">
                        {prog.category}
                      </span>
                    </div>
                    <Link href={`/programmes/${prog.id}`}>
                      <CardTitle className="text-lg leading-snug">{prog.title}</CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {prog.description}
                    </p>
                  </CardContent>
                  <div className="p-4 flex items-center justify-between border-t">
                    <span className="text-sm font-medium">
                      {prog.cost !== null ? `${prog.currency} ${prog.cost}` : "Price on request"}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleUnsave(prog.id)}
                    >
                      Unsave
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
