import "server-only";
import { sampleDatasets, type Dataset } from "@content/data/sample";

export type DashboardData = {
  mode: "sample" | "live";
  datasets: Dataset[];
  notice: string;
};

/**
 * Single place where dashboard data is loaded. It runs on the SERVER, so any
 * API key stays out of the browser.
 *
 * To connect real data later:
 *   1. Add the key to a server-only environment variable (e.g. DATA_API_KEY, never NEXT_PUBLIC_*).
 *   2. Fetch the official series here with fetch(), map it to the Dataset shape,
 *      and set `retrievedAt` to the time of the request and `isSample: false`.
 *   3. Return { mode: "live", ... }.
 * Until then this function honestly returns the labelled sample.
 */
export async function getDashboardData(): Promise<DashboardData> {
  return {
    mode: "sample",
    datasets: sampleDatasets,
    notice:
      "No live data connection is configured, so this page shows an illustrative sample. The numbers are synthetic and are not official statistics.",
  };
}
