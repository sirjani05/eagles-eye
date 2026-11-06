"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProgramme } from "@/lib/api/programmesApi";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type Programme = import("@/types/index").Programme;

export default async function ProgrammeDetailsPage() {
  const params = await useParams();
  const router = useRouter();
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error: err } = await getProgramme(String(params.slug));
        if (err) throw new Error(err.message);
        if (!mounted) return;
        if (!data) {
          router.push("/programmes");
          return;
        }
        setProgramme(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load programme.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.slug, router]);

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
        <Link href="/programmes">
          <Button>Back to programmes</Button>
        </Link>
      </div>
    );
  }

  const prog = programme;

  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-primary/90 text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="flex-1">
              <Badge variant="outline" className="mb-4">{prog.category}</Badge>
              <Badge variant="secondary" className="mb-4">{prog.level}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {prog.title}
              </h1>
              <p className="text-lg text-primary/90 max-w-2xl">
                {prog.description}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/programmes">
                <Button variant="outline">Back to programmes</Button>
              </Link>
              <Button>Save programme</Button>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-4 gap-4 text-sm text-primary/80">
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-xs text-primary/60 uppercase tracking-wider">Duration</div>
              <div className="font-medium">{prog.duration}</div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-xs text-primary/60 uppercase tracking-wider">Mode</div>
              <div className="font-medium">{prog.mode}</div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-xs text-primary/60 uppercase tracking-wider">Location</div>
              <div className="font-medium">{prog.location}</div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-xs text-primary/60 uppercase tracking-wider">Cost</div>
              <div className="font-medium">
                {prog.cost !== null ? `${prog.currency} ${prog.cost}` : "Price on request"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>About this programme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {prog.description}
              </p>
            </CardContent>
            <CardFooter className="pt-6">
              <Link
                href={`/providers/${prog.provider_id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View provider: {prog.provider?.name || "Provider"}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
