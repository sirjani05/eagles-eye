import { getProgramme } from "@/lib/api/programmesApi";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return {
    title: `Programme | Eagle&apos;s Eye`,
  };
}

export default async function ProgrammeDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await getProgramme(slug);

  if (error || !data) {
    notFound();
  }

  const prog = data;

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
              <div className="text-xs text-primary/60 uppercase tracking-wider">
                Duration
              </div>
              <div className="font-medium">{prog.duration}</div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-xs text-primary/60 uppercase tracking-wider">
                Mode
              </div>
              <div className="font-medium">{prog.mode}</div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-xs text-primary/60 uppercase tracking-wider">
                Location
              </div>
              <div className="font-medium">{prog.location}</div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="text-xs text-primary/60 uppercase tracking-wider">
                Cost
              </div>
              <div className="font-medium">
                {prog.cost !== null
                  ? `${prog.currency} ${prog.cost}`
                  : "Price on request"}
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
