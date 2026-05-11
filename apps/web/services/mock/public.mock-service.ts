import { featuredJobs, publicStats } from "@/lib/mocks";

export const publicMockService = {
  async getFeaturedJobs() {
    return featuredJobs;
  },
  async getPublicStats() {
    return publicStats;
  },
  async getCareers() {
    return [
      { id: "career-systems", name: "Ingeniería de Sistemas" },
      { id: "career-software", name: "Ingeniería de Software" },
    ];
  },
  async getSkills() {
    return [
      { id: "skill-react", name: "React", category: "Frontend", type: "TECNICA" },
      { id: "skill-typescript", name: "TypeScript", category: "Frontend", type: "TECNICA" },
      { id: "skill-node", name: "Node.js", category: "Backend", type: "TECNICA" },
      { id: "skill-sql", name: "SQL", category: "Base de datos", type: "TECNICA" },
      { id: "skill-testing", name: "Testing", category: "Calidad", type: "TECNICA" },
      { id: "skill-git", name: "Git", category: "Herramientas", type: "TECNICA" },
    ];
  },
  async getJobById(id: string) {
    return featuredJobs.find((job) => job.id === id) ?? null;
  },
};
