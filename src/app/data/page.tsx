import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import { candidateSources } from "@content/data/sample";
import { getDashboardData } from "@/lib/data-source";
import { Container, PageHeader } from "@/components/ui";
import { DataDashboard } from "@/components/DataDashboard";

export const metadata: Metadata = {
  title: "Data dashboard",
  description: "Macroeconomic and market charts for India, shown with an illustrative sample until real data is connected.",
};

export default async function DataPage() {
  const data = await getDashboardData();

  return (
    <>
      <PageHeader
        title="Data dashboard"
        intro="Charts for inflation, growth, interest rates, the yield curve and a market index. Each one states its source, unit and retrieval time."
      />
      <Container>
        {data.mode === "sample" && (
          <div role="note" className="mb-8 flex gap-3 rounded-2xl border border-warn/40 bg-warn/10 p-5">
            <TriangleAlert size={20} className="mt-0.5 shrink-0 text-warn" aria-hidden />
            <div className="text-sm leading-relaxed">
              <p className="font-medium">Sample data, not live and not official</p>
              <p className="mt-1 text-muted">{data.notice}</p>
              <p className="mt-2 text-muted">
                To connect real data, edit <code>src/lib/data-source.ts</code>. It runs on the server, so keep any API key in a server-only
                environment variable and never in browser code. See the README for the steps.
              </p>
            </div>
          </div>
        )}

        <DataDashboard datasets={data.datasets} />

        <section className="mt-14" aria-labelledby="src">
          <h2 id="src" className="display text-3xl">
            Where real data could come from
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">Candidates to evaluate. None of these is connected yet, and each has its own terms of use.</p>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {candidateSources.map((s) => (
              <li key={s.name} className="grid gap-1 py-4 sm:grid-cols-[1.2fr_1fr] sm:gap-8">
                <span>{s.name}</span>
                <span className="text-sm text-muted">{s.use}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Nothing on this page is investment advice. Past patterns, including historical backtests, do not guarantee future performance.
          </p>
        </section>
      </Container>
    </>
  );
}
