"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Simulate loading then mark ready
      await new Promise((r) => setTimeout(r, 300));
      if (!mounted) return;
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading provider dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Provider Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your programmes and provider profile
            </p>
          </div>
          <Link href="/provider/programmes/new">
            <Button>Add Programme</Button>
          </Link>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Programmes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Draft, published, and under review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Awaiting administrator approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Published</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Live and visible to learners</p>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Your programmes</h2>
            <div className="text-center py-12 text-muted-foreground">
              You haven&apos;t created any programmes yet.
            </div>
            <div className="mt-4 text-center">
              <Link href="/provider/programmes/new">
                <Button>Create your first programme</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
