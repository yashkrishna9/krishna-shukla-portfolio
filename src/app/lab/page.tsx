import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHeader } from "@/components/ui";
import { labModels } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Economics Lab",
  description: "Four working interactive models: consumer choice, monopoly, supply and demand, and linear regression.",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        title="Economics Lab"
        intro="Four models that calculate real results from the numbers you set. Everything runs in your browser, and each page states its assumptions and units."
      />
      <Container>
        <ul className="grid gap-5 md:grid-cols-2">
          {labModels.map((m) => (
            <li key={m.id}>
              <Link href={`/lab/${m.id}`} className="glass group flex h-full flex-col rounded-3xl p-7 transition-colors hover:border-line-strong">
                <p className="text-sm text-muted">{m.area}</p>
                <h2 className="display mt-1 text-4xl">{m.name}</h2>
                <p className="mt-3 leading-relaxed text-muted">{m.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5 text-xs text-muted">
                  {m.features.map((f) => (
                    <li key={f} className="rounded-md bg-line px-2 py-0.5">
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 pt-2 text-sm">
                  Open model <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
          These are teaching models with simplified assumptions. They illustrate how the theory works and are not forecasts or empirical findings.
        </p>
      </Container>
    </>
  );
}
