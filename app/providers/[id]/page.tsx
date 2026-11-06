import { getProvider } from "@/lib/api/providersApi";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  return {
    title: `Provider | Eagle&apos;s Eye`,
  };
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await getProvider(id);

  if (error || !data) {
    notFound();
  }

  const provider = data;

  return (
    <div className="min-h-screen flex flex-col">
      <section className="border-b px-4 py-6">
        <div className="container mx-auto">
          <Link
            href="/programmes"
            className="text-sm text-muted-foreground hover:underline mb-2 inline-block"
          >
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
                <>{provider.contact_email && <span>{provider.contact_email}</span>}{" "}
                  {provider.website && (
                    <>
                      <span>•</span>
                      <Link
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </Link>
                    </>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Programmes by {provider.name}
          </h2>
          <div className="text-center py-20 text-muted-foreground">
            No programmes listed yet. Check back soon.
          </div>
        </div>
      </section>
    </div>
  );
}
