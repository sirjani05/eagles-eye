"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { listSavedProgrammes } from "@/lib/api/programmesApi";
import type { Programme } from "@/types/index";
import { ProgrammeCard } from "@/components/programmes/ProgrammeCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export default function DashboardPage() {
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
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.full_name || user?.email || "Learner"}
            </p>
          </div>
          <Link href="/programmes" className="text-sm font-medium text-primary hover:underline">
            Browse programmes &rarr;
          </Link>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Saved Programmes</CardTitle>
                <CardDescription>
                  Programmes you&apos;ve saved for later
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-6">
                <Link href="/saved" className="text-sm font-medium text-primary hover:underline">
                  View all saved
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Role</CardTitle>
                <CardDescription>
                  {user?.role?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Learner"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sign out to switch accounts.
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold mb-4">Your saved programmes</h2>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/50 p-4 text-sm text-destructive mb-6">
              {error}
            </div>
          )}

          {programmes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                You haven&apos;t saved any programmes yet. Browse programmes and save the ones that interest you.
              </p>
              <Link href="/programmes">
                <Button>Browse programmes</Button>
              </Link>
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
