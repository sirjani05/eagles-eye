"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProvider } from "@/lib/api/providersApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

type Provider = import("@/types/index").Provider;

export default async function ProviderProfilePage() {
  const params = await useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error: err } = await getProvider(String(params.id));
        if (err) throw new Error(err.message);
        if (!mounted) return;
        setProvider(data ?? null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load provider.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading provider...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive">{error || "Provider not found."}</p>
        <Link href="/programmes">
          <button className="text-sm font-medium text-primary hover:underline">
            Back to programmes
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6">
        <div className="container mx-auto">
          <Link href="/programmes" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
            &larr; Back to programmes
          </Link>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-4">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-xl font-bold">
                {provider.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{provider.name}</h1>
              <p className="text-muted-foreground">{provider.description}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                {provider.contact_email && <span>{provider.contact_email}</span>}
                {provider.website && (
                  <>
                    <span> • </span>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Website
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">Programmes by {provider.name}</h2>
          <div className="text-center py-20 text-muted-foreground">
            No programmes listed yet. Check back soon.
          </div>
        </div>
      </section>
    </div>
  );
}
