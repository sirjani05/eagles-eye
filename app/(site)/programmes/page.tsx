"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { listProgrammes } from "@/lib/api/programmesApi";
import type { Programme, ProgrammeFilters } from "@/types/index";
import { ProgrammeCard, ProgrammeCardSkeleton } from "@/components/programmes/ProgrammeCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import {
  Search, Filter, X, ChevronDown, ChevronUp, Scale, BookOpen, Globe, Zap, Sparkles,
  ArrowRight, Minus, Plus
} from "lucide-react";

const CATEGORIES = ["Data & Analytics", "Design", "Engineering", "Marketing"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const MODES = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-person" },
  { value: "hybrid", label: "Hybrid" },
];

const MAX_COMPARE = 4;

export default function ProgrammesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProgrammeFilters>({
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    level: searchParams.get("level") || undefined,
    mode: searchParams.get("mode") || undefined,
    min_cost: searchParams.get("min_cost") ? Number(searchParams.get("min_cost")) : undefined,
    max_cost: searchParams.get("max_cost") ? Number(searchParams.get("max_cost")) : undefined,
  });
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [compareList, setCompareList] = useState<Programme[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showActiveFilters, setShowActiveFilters] = useState(false);

  const limit = 12;

  const fetchProgrammes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await listProgrammes({ ...filters, page, limit });
      if (err) throw new Error(err.message);
      setProgrammes(data ?? []);
      setTotal(data?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programmes.");
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchProgrammes();
      if (!mounted) return;
    })();
    return () => { mounted = false; };
  }, [fetchProgrammes]);

  const updateFilters = (newFilters: Partial<ProgrammeFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
      else params.delete(key);
    });
    params.set("page", "1");
    router.push(`/programmes?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({});
    router.push("/programmes");
  };

  const toggleCompare = (programme: Programme) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === programme.id)) {
        return prev.filter((p) => p.id !== programme.id);
      }
      if (prev.length >= MAX_COMPARE) {
        return [...prev.slice(1), programme];
      }
      return [...prev, programme];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.level) count++;
    if (filters.mode) count++;
    if (filters.min_cost) count++;
    if (filters.max_cost) count++;
    return count;
  }, [filters]);

  if (loading && programmes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 glass border-b border-border">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="h-8 w-24 bg-surface rounded animate-pulse" />
            <div className="h-8 w-24 bg-surface rounded animate-pulse" />
          </nav>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="space-y-8">
            <div className="h-8 w-48 bg-surface rounded animate-pulse" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <ProgrammeCardSkeleton key={i} />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Eagle's Eye</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/compare" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              <Scale className="h-4 w-4 mr-1" />
              Compare ({compareList.length}/{MAX_COMPARE})
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="border-b border-border bg-surface/30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Programmes</h1>
                <p className="text-foreground-muted mt-1">
                  {total} programme{total !== 1 ? "s" : ""} found
                  {activeFilterCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                      {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="md:hidden gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="h-4 w-4" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Active filters">
                {filters.search && (
                  <Badge variant="outline" className="gap-1" onClick={() => updateFilters({ search: undefined })}>
                    <Search className="h-3 w-3" /> "{filters.search}" <X className="h-3 w-3" />
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="outline" className="gap-1" onClick={() => updateFilters({ category: undefined })}>
                    <BookOpen className="h-3 w-3" /> {filters.category} <X className="h-3 w-3" />
                  </Badge>
                )}
                {filters.level && (
                  <Badge variant="outline" className="gap-1" onClick={() => updateFilters({ level: undefined })}>
                    <Zap className="h-3 w-3" /> {filters.level} <X className="h-3 w-3" />
                  </Badge>
                )}
                {filters.mode && (
                  <Badge variant="outline" className="gap-1" onClick={() => updateFilters({ mode: undefined })}>
                    <Globe className="h-3 w-3" /> {filters.mode} <X className="h-3 w-3" />
                  </Badge>
                )}
                {(filters.min_cost || filters.max_cost) && (
                  <Badge variant="outline" className="gap-1" onClick={() => updateFilters({ min_cost: undefined, max_cost: undefined })}>
                    <Sparkles className="h-3 w-3" />
                    £{filters.min_cost || 0}–£{filters.max_cost || "∞"} <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Search & Quick Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
                <Input
                  placeholder="Search programmes..."
                  value={filters.search || ""}
                  onChange={(e) => updateFilters({ search: e.target.value || undefined })}
                  className="pl-10"
                />
              </div>
              <div className="hidden md:flex gap-2">
                <Select
                  placeholder="Category"
                  options={[{ value: "", label: "All Categories" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
                  value={filters.category || ""}
                  onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                />
                <Select
                  placeholder="Level"
                  options={[{ value: "", label: "All Levels" }, ...LEVELS.map((l) => ({ value: l, label: l }))]}
                  value={filters.level || ""}
                  onChange={(e) => updateFilters({ level: e.target.value || undefined })}
                />
                <Select
                  placeholder="Format"
                  options={[{ value: "", label: "All Formats" }, ...MODES]}
                  value={filters.mode || ""}
                  onChange={(e) => updateFilters({ mode: e.target.value || undefined })}
                />
</div>
          </div>
        </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filters Button */}
            <div className="lg:hidden">
              <Button variant="outline" onClick={() => setMobileFiltersOpen(true)} className="w-full gap-2">
                <Filter className="h-4 w-4" />
                Filters {activeFilterCount > 0 && <Badge variant="default">{activeFilterCount}</Badge>}
              </Button>
            </div>

            {/* Programme Grid */}
            <div className="flex-1">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-6 flex items-center gap-3">
                  <span className="text-destructive">{error}</span>
                  <Button variant="ghost" size="sm" onClick={fetchProgrammes}>
                    Retry
                  </Button>
                </div>
              )}

              {programmes.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No programmes found</h3>
                  <p className="text-foreground-muted mb-4">Try adjusting your filters or search terms</p>
                  <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programmes.map((prog) => (
                      <ProgrammeCard
                        key={prog.id}
                        programme={prog}
                        onCompareToggle={toggleCompare}
                        isCompared={compareList.some((p) => p.id === prog.id)}
                        showCompare
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {total > limit && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-foreground-muted">
                        Page {page} of {Math.ceil(total / limit)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(Math.ceil(total / limit), p + 1))}
                        disabled={page >= Math.ceil(total / limit)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* Mobile Filters Drawer */}
    <Drawer
      isOpen={mobileFiltersOpen}
      onClose={() => setMobileFiltersOpen(false)}
      title="Filters"
      description={`${activeFilterCount} active filter${activeFilterCount !== 1 ? "s" : ""}`}
      side="left"
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Search</h3>
          <Input
            placeholder="Search programmes..."
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value || undefined })}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.category === cat}
                  onChange={() => updateFilters({ category: filters.category === cat ? undefined : cat })}
                />
                <span className="text-sm">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Level</h3>
          <div className="space-y-2">
            {LEVELS.map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.level === level}
                  onChange={() => updateFilters({ level: filters.level === level ? undefined : level })}
                />
                <span className="text-sm">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Format</h3>
          <div className="space-y-2">
            {MODES.map((mode) => (
              <label key={mode.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.mode === mode.value}
                  onChange={() => updateFilters({ mode: filters.mode === mode.value ? undefined : mode.value })}
                />
                <span className="text-sm">{mode.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Tuition Range (GBP)</h3>
          <Slider
            min={0}
            max={5000}
            step={100}
            defaultValue={[filters.min_cost || 0, filters.max_cost || 5000]}
            showValue
            valueLabel={(v) => `£${v.toLocaleString()}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split(",").map(Number);
              updateFilters({ min_cost: min || undefined, max_cost: max === 5000 ? undefined : max });
            }}
          />
        </div>

        {activeFilterCount > 0 && (
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            Clear all filters
          </Button>
        )}
      </div>
    </Drawer>

    {/* Comparison Bar */}
    {compareList.length > 0 && (
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border animate-slide-up">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {compareList.map((prog) => (
              <div key={prog.id} className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 whitespace-nowrap flex-shrink-0">
                <span className="text-sm font-medium truncate max-w-[150px]">{prog.title}</span>
                <button
                  onClick={() => removeFromCompare(prog.id)}
                  className="text-foreground-muted hover:text-destructive transition-colors"
                  aria-label={`Remove ${prog.title} from comparison`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground-muted">
              {compareList.length}/{MAX_COMPARE} selected
            </span>
            <Link href="/compare">
              <Button size="sm" disabled={compareList.length < 2}>
                <Scale className="h-4 w-4 mr-1" />
                Compare
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )}
  </div>
);