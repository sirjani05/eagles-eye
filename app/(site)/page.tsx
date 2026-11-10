"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listProgrammes } from "@/lib/api/programmesApi";
import { ProgrammeCard } from "@/components/programmes/ProgrammeCard";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
  "Data & Analytics",
  "Design",
  "Engineering",
  "Marketing",
];

export default function Landing() {
  const [programmes, setProgrammes] = useState<import("@/types/index").Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error: err } = await listProgrammes({ limit: 6 });
        if (err) throw new Error(err.message);
        if (!mounted) return;
        setProgrammes(data ?? []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load programmes.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const featured = programmes.slice(0, 3);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Eagle&apos;s Eye</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading programmes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Eagle&apos;s Eye</h1>
        <p className="text-destructive mb-6">
          Unable to load programmes. Please try again later.
        </p>
        <Button asChild>
          <Link href="/programmes">Browse Programmes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-primary text-primary-foreground py-20 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Discover your next learning journey
          </h1>
          <p className="text-lg text-primary/90 mb-8 max-w-2xl mx-auto">
            Find and compare education programmes from top providers. Whether
            you&apos;re starting a new career or advancing your skills, we help you
            find the right programme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/programmes">Browse programmes</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">Join as a learner</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured programmes</h2>
              <p className="text-muted-foreground">
                Popular programmes to get you started
              </p>
            </div>
            <Link
              href="/programmes"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No featured programmes available at the moment.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((prog) => (
                <ProgrammeCard key={prog.id} programme={prog} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Trusted by leading providers</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
            {CATEGORIES.map((cat) => (
              <span key={cat} className="text-sm font-medium tracking-wider uppercase">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Ready to find your programme?</h2>
          <p className="text-muted-foreground mb-8">
            Browse our catalogue and save programmes that interest you.
          </p>
          <Link href="/programmes">
            <Button size="lg">Browse all programmes</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
