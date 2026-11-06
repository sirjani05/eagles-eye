"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { listProgrammes } from "@/lib/api/programmesApi";
import type { ProgrammeFilters } from "@/types/index";
import { ProgrammeCard } from "@/components/programmes/ProgrammeCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const CATEGORIES = ["Data & Analytics", "Design", "Engineering", "Marketing"];

export default function ProgrammesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProgrammeFilters>({
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
  });
  const [programmes, setProgrammes] = useState<import("@/types/index").Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProgrammes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await listProgrammes(filters);
      if (err) throw new Error(err.message);
      setProgrammes(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programmes.");
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchProgrammes();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProgrammes]);

  const updateQuery = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/programmes?${params.toString()}`);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading programmes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto">
          <Input
            label="Search programmes"
            placeholder="Search by title, category or provider"
            value={filters.search ?? ""}
            onChange={(e) => {
              updateQuery("search", e.target.value);
            }}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={filters.category === cat ? "primary" : "outline"}
                size="sm"
                onClick={() =>
                  updateQuery("category", filters.category === cat ? undefined : cat)
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Programmes</h2>
          <p className="text-muted-foreground mb-6">
            Explore {programmes.length} programme{programmes.length === 1 ? "" : "s"}
          </p>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/50 p-4 text-sm text-destructive mb-6">
              {error}
            </div>
          )}

          {programmes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No programmes match your filters. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {programmes.map((prog) => (
                <ProgrammeCard key={prog.id} programme={prog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
