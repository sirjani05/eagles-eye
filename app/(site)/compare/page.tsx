"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Scale, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProgramme } from "@/lib/api/programmesApi";
import type { Programme } from "@/types/index";

function formatCost(cost: number | null | undefined, currency: string | null | undefined) {
  if (cost == null) return "Price on request";
  const symbols: Record<string, string> = { GBP: "£", USD: "$", EUR: "€" };
  const symbol = symbols[currency || "GBP"] || currency || "";
  return `${symbol}${cost.toLocaleString()}`;
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";
  const ids = useMemo(
    () => [...new Set(idsParam.split(",").filter(Boolean))].slice(0, 4),
    [idsParam],
  );
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(ids.length > 0);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (ids.length === 0) {
      setProgrammes([]);
      setError("");
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError("");
    Promise.all(
      ids.map(async (id) => {
        const { data, error: fetchError } = await getProgramme(id);
        if (fetchError) throw new Error(fetchError.message);
        if (!data) throw new Error(`Could not find programme ${id}.`);
        return data;
      }),
    )
      .then((data) => {
        if (!cancelled) setProgrammes(data);
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load selected programmes.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  function removeProgramme(id: string) {
    const remaining = ids.filter((programmeId) => programmeId !== id);
    const query = remaining.length
      ? `?ids=${encodeURIComponent(remaining.join(","))}`
      : "";
    router.push(`/compare${query}`);
  }

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <Link
        href="/programmes"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Browse programmes
      </Link>

      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <Scale className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-wide">Programme comparison</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">Compare programmes</h1>
        <p className="mt-2 text-foreground-muted">
          Compare up to four programmes side by side to find the right fit.
        </p>
      </header>

      {loading ? (
        <p role="status" className="rounded-xl border border-border p-8 text-center text-foreground-muted">
          Loading selected programmes…
        </p>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-medium">Unable to load the comparison.</p>
          <p className="mt-2 text-sm text-foreground-muted">{error}</p>
          <Link href="/programmes" className="mt-5 inline-block">
            <Button variant="outline">Browse programmes</Button>
          </Link>
        </div>
      ) : programmes.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface/30 p-8 text-center md:p-12">
          <h2 className="text-xl font-semibold">Choose programmes to compare</h2>
          <p className="mx-auto mt-2 max-w-lg text-foreground-muted">
            Select at least two programmes from the programmes list, then open Compare to view them side by side.
          </p>
          <Link href="/programmes" className="mt-6 inline-block">
            <Button>Browse programmes</Button>
          </Link>
        </div>
      ) : (
        <>
          {programmes.length < 2 && (
            <p className="mb-4 rounded-lg border border-border bg-surface/30 p-4 text-sm text-foreground-muted">
              Select at least one more programme to compare. You can compare up to four.
            </p>
          )}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-surface/50">
                  <th scope="col" className="w-40 border-b border-r border-border p-4 text-sm font-semibold">
                    Programme
                  </th>
                  {programmes.map((programme) => (
                    <th key={programme.id} scope="col" className="min-w-52 border-b border-border p-4 align-top">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/programmes/${programme.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {programme.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeProgramme(programme.id)}
                          aria-label={`Remove ${programme.title} from comparison`}
                          className="rounded p-1 text-foreground-muted hover:bg-surface hover:text-destructive"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm font-normal text-foreground-muted">
                        {programme.provider?.name || "Provider not listed"}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ["Category", (programme: Programme) => programme.category || "—"],
                  ["Level", (programme: Programme) => programme.level || "—"],
                  ["Duration", (programme: Programme) => programme.duration || "—"],
                  ["Study mode", (programme: Programme) => programme.mode || "—"],
                  ["Location", (programme: Programme) => programme.location || "—"],
                  ["Tuition", (programme: Programme) => formatCost(programme.cost, programme.currency)],
                  ["Description", (programme: Programme) => programme.description || "No description provided."],
                ] as const).map(([label, getValue]) => (
                  <tr key={label} className="odd:bg-background even:bg-surface/20">
                    <th scope="row" className="border-r border-border p-4 text-sm font-medium">
                      {label}
                    </th>
                    {programmes.map((programme) => (
                      <td key={programme.id} className="border-t border-border p-4 text-sm text-foreground-muted">
                        {getValue(programme)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-foreground-muted">Loading comparison…</div>}>
      <CompareContent />
    </Suspense>
  );
}
