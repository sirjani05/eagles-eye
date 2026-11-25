import Link from "next/link";
import { ArrowUpRight, Building2, Globe2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MOCK_PROVIDERS } from "@/data/mock";

export default function ProvidersPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Education partners
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Our providers</h1>
        <p className="mt-3 text-foreground-muted">
          Explore education providers and the programmes they offer.
        </p>
      </header>

      {MOCK_PROVIDERS.length === 0 ? (
        <p className="rounded-lg border border-border p-8 text-center text-foreground-muted">
          No providers are listed yet. Please check back soon.
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-foreground-muted">
            {MOCK_PROVIDERS.length} provider{MOCK_PROVIDERS.length === 1 ? "" : "s"}
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_PROVIDERS.map((provider) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Card variant="interactive" className="h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle className="flex items-start justify-between gap-3">
                      <span>{provider.name}</span>
                      <ArrowUpRight
                        className="mt-0.5 h-5 w-5 shrink-0 text-foreground-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-3">
                    <p className="line-clamp-3 min-h-[4.5rem] text-sm text-foreground-muted">
                      {provider.description}
                    </p>
                    <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-foreground-muted">
                      {provider.website && (
                        <span className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span className="truncate">{provider.website.replace(/^https?:\/\//, "")}</span>
                        </span>
                      )}
                      {provider.contact_email && (
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span className="truncate">{provider.contact_email}</span>
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
