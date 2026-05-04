import { LandingPage } from "@/components/public/landing-page";
import { publicService } from "@/services";
import type { JobSummary, PublicStat } from "@/types";

export default async function Page() {
  let featuredJobs: JobSummary[] = [];
  let publicStats: PublicStat[] = [];
  let errorMessage: string | undefined;

  try {
    [featuredJobs, publicStats] = await Promise.all([
      publicService.getFeaturedJobs(),
      publicService.getPublicStats(),
    ]);
  } catch {
    errorMessage = "No se pudieron cargar las ofertas públicas en este momento.";
  }

  return <LandingPage featuredJobs={featuredJobs} publicStats={publicStats} errorMessage={errorMessage} />;
}
