import { PublicOffersPage } from "@/components/public/public-offers-page";
import { publicService } from "@/services";
import type { JobSummary } from "@/types";

export default async function Page() {
  let jobs: JobSummary[] = [];
  let errorMessage: string | undefined;

  try {
    jobs = await publicService.getFeaturedJobs();
  } catch {
    errorMessage = "No se pudieron cargar las ofertas desde el backend.";
  }

  return <PublicOffersPage jobs={jobs} errorMessage={errorMessage} />;
}
