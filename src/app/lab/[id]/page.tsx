import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container } from "@/components/ui";
import { labModels, type LabModelId } from "@/lib/lab";
import { ConsumerChoice } from "@/components/lab/ConsumerChoice";
import { Monopoly } from "@/components/lab/Monopoly";
import { SupplyDemand } from "@/components/lab/SupplyDemand";
import { Regression } from "@/components/lab/Regression";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return labModels.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const m = labModels.find((x) => x.id === id);
  return m ? { title: m.name, description: m.blurb } : { title: "Model not found" };
}

const views: Record<LabModelId, React.ReactNode> = {
  "consumer-choice": <ConsumerChoice />,
  monopoly: <Monopoly />,
  "supply-demand": <SupplyDemand />,
  regression: <Regression />,
};

export default async function LabModelPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const model = labModels.find((m) => m.id === id);
  if (!model) notFound();

  const others = labModels.filter((m) => m.id !== model.id);

  return (
    <Container className="pt-10">
      <Breadcrumbs trail={[{ label: "Economics Lab", href: "/lab" }, { label: model.name }]} />
      <h1 className="display text-5xl sm:text-6xl">{model.name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{model.blurb}</p>
      <div className="mt-10">{views[model.id]}</div>

      <nav aria-label="Other models" className="mt-16 border-t border-line pt-8">
        <h2 className="text-sm text-muted">More models</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={`/lab/${o.id}`} className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-text">
                {o.name}
              </Link>
            </li>
          ))}
          {model.project && (
            <li>
              <Link href={`/projects/${model.project}`} className="rounded-full border border-accent/50 px-4 py-2 text-sm transition-colors hover:bg-accent/10">
                Related project page
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </Container>
  );
}
