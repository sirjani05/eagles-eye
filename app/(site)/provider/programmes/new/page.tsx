"use client";

import { useRouter } from "next/navigation";
import { ProgrammeForm } from "@/components/programmes/ProgrammeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function NewProgrammePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6 bg-background/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create Programme</h1>
            <p className="text-muted-foreground">
              Add a new programme to your provider profile
            </p>
          </div>
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
                onSuccess={() => {
                  router.push("/provider/dashboard");
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
