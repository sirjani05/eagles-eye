"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminStats } from "@/lib/api/adminApi";
import type { AdminStats } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await getAdminStats();
      if (err) throw new Error(err.message);
      setStats(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchStats();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Administrator Dashboard</h1>
            <p className="text-muted-foreground">
              Moderate programmes and oversee the platform
            </p>
          </div>
          <Link href="/admin/programmes/review">
            <Button>Review Programmes</Button>
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

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Programmes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats?.total_programmes ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-warning-foreground">
                  {stats?.pending_reviews ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.total_users ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats?.total_providers ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent activity</h2>
            <div className="text-center py-12 text-muted-foreground">
              No recent activity to display.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
