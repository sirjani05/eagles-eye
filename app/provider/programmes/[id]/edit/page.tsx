"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProgramme, updateProgramme } from "@/lib/api/programmesApi";
import { ProgrammeForm } from "@/components/programmes/ProgrammeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { Programme } from "@/types/index";

export default function EditProgrammePage() {
  const router = useRouter();
  const params = useParams();
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProgramme = useCallback(async () => {
    const id = String(params.id);
    setLoading(true);
    try {
      const { data, error: err } = await getProgramme(id);
      if (err) throw new Error(err.message);
      setProgramme(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programme.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchProgramme();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProgramme]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading programme...</p>
        </div>
      </div>
    );
  }

  if (error || !programme) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive">{error || "Programme not found."}</p>
        <Link href="/provider/dashboard">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Programme</h1>
            <p className="text-muted-foreground">
              Update details for {programme.title}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Programme details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgrammeForm
                initial={{
                  title: programme.title,
                  description: programme.description,
                  category: programme.category,
                  level: programme.level,
                  duration: programme.duration,
                  cost: programme.cost,
                  currency: programme.currency,
                  location: programme.location,
                  mode: programme.mode,
                  status: programme.status,
                }}
                programmeId={programme.id}
                isEdit
                onSuccess={() => {
                  router.push("/provider/dashboard");
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
