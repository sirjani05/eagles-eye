"use client";

import { useEffect, useState, useCallback } from "react";
import { listPendingProgrammes, reviewProgramme } from "@/lib/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface PendingProgramme {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  level?: string | null;
  provider?: { name: string } | null;
  created_at: string;
}

export default function ReviewPage() {
  const [programmes, setProgrammes] = useState<PendingProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewing, setReviewing] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await listPendingProgrammes();
      if (err) throw new Error(err.message);
      setProgrammes((data ?? []) as PendingProgramme[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pending programmes.");
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchPending();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [fetchPending]);

  const handleReview = async (id: string, decision: "approved" | "rejected") => {
    setReviewing(id);
    try {
      const { error: err } = await reviewProgramme(id, decision);
      if (err) throw new Error(err.message);
      setProgrammes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed.");
    } finally {
      setReviewing(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading review queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Programme Review</h1>
            <p className="text-muted-foreground">
              Approve or reject programmes awaiting moderation
            </p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to dashboard
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

          <h2 className="text-xl font-bold mb-4">
            Pending Review ({programmes.length})
          </h2>

          {programmes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No programmes pending review. All caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {programmes.map((prog) => (
                <Card key={prog.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>{prog.title}</CardTitle>
                    <Badge variant="outline">pending_review</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {prog.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <span>{prog.category}</span>
                      <span>•</span>
                      <span>{prog.level}</span>
                      <span>•</span>
                      <span>{prog.provider?.name || "Unknown provider"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => void handleReview(prog.id, "approved")}
                        disabled={reviewing === prog.id}
                      >
                        {reviewing === prog.id ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleReview(prog.id, "rejected")}
                        disabled={reviewing === prog.id}
                      >
                        {reviewing === prog.id ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
