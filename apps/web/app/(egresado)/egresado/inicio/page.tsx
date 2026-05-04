import { GraduateHomePage } from "@/components/graduate/graduate-home-page";
import { publicService } from "@/services";

export default async function Page() {
  const featuredJobs = await publicService.getFeaturedJobs().catch(() => []);
  return <GraduateHomePage featuredJobs={featuredJobs} />;
}
