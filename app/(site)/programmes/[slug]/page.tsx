import { getMockProgrammeById } from "@/data/mock";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const generateStaticParams = async () => {
  return [
    { slug: "prog-1" },
    { slug: "prog-2" },
    { slug: "prog-3" },
    { slug: "prog-4" },
  ];
};

export default function ProgrammeDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const programme = getMockProgrammeById(params.slug);

  if (!programme) {
    notFound();
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
