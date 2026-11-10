import { getMockProgrammeById } from "@/data/mock";
import { notFound } from "next/navigation";
import { ProgrammeForm } from "@/components/programmes/ProgrammeForm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const generateStaticParams = async () => {
  return [
    { id: "prog-1" },
    { id: "prog-2" },
    { id: "prog-3" },
    { id: "prog-4" },
  ];
};

export default function EditProgrammePage({
  params,
}: {
  params: { id: string };
}) {
  const programme = getMockProgrammeById(params.id);

  if (!programme) {
    notFound();
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
          <Link href="/provider/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
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
                  description: programme.description ?? undefined,
                  category: programme.category ?? undefined,
                  level: programme.level ?? undefined,
                  duration: programme.duration ?? undefined,
                  cost: programme.cost ?? undefined,
                  currency: programme.currency ?? "GBP",
                  location: programme.location ?? undefined,
                  mode: programme.mode ?? "online",
                  status: programme.status,
                }}
                programmeId={programme.id}
                isEdit
                onSuccess={() => {
                  // Navigation is handled client-side by the form's router
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
