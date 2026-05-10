import { applicationStatuses, companyValidationStatuses, offerStatuses, reportStatuses } from "@/lib/constants";
import {
  mockAdminCompanies,
  mockAdminGraduates,
  mockAdminOffers,
  mockAdminReports,
  mockAdminSkills,
} from "@/lib/mocks";
import type {
  AdminApplicationsFilters,
  AdminCompanyValidationInput,
  AdminOfferModerationInput,
  AdminReportRequestInput,
  AdminSkillCreateInput,
  AdminSkillUpdateInput,
} from "@/types";

function computeStats() {
  const totalApplications = mockAdminGraduates.reduce(
    (accumulator, graduate) => accumulator + graduate.postulaciones,
    0,
  );
  const hiredApplications = Math.max(0, Math.round(totalApplications * 0.68));

  return {
    totalGraduates: mockAdminGraduates.length,
    activeCompanies: mockAdminCompanies.filter(
      (company) => company.estadoValidacion === companyValidationStatuses.approved,
    ).length,
    pendingCompanies: mockAdminCompanies.filter(
      (company) => company.estadoValidacion === companyValidationStatuses.pending,
    ).length,
    activeOffers: mockAdminOffers.filter((offer) => offer.estado === offerStatuses.active).length,
    monthlyApplications: totalApplications,
    employabilityRate:
      totalApplications > 0 ? Math.round((hiredApplications / totalApplications) * 100) : 0,
  };
}

function buildMockApplications() {
  return [
    {
      id: "application-1",
      offerId: "job-1",
      graduateId: "graduate-1",
      title: "Desarrollador Frontend Junior",
      company: "Tech Solutions Perú",
      status: applicationStatuses.reviewing,
      appliedAt: "2026-05-03",
    },
    {
      id: "application-2",
      offerId: "job-2",
      graduateId: "graduate-1",
      title: "Analista QA Junior",
      company: "Innova Digital",
      status: applicationStatuses.applied,
      appliedAt: "2026-05-04",
    },
    {
      id: "application-3",
      offerId: "job-4",
      graduateId: "graduate-2",
      title: "Data Analyst Junior",
      company: "Alpha Analytics",
      status: applicationStatuses.hired,
      appliedAt: "2026-05-02",
    },
  ];
}

const mockAdminApplications = buildMockApplications();

export const adminMockService = {
  async getStats() {
    return computeStats();
  },
  async getGraduates() {
    return mockAdminGraduates;
  },
  async getGraduateById(id: string) {
    return mockAdminGraduates.find((graduate) => graduate.id === id) ?? null;
  },
  async getApplications(filters: AdminApplicationsFilters = {}) {
    return mockAdminApplications.filter((application) => {
      const matchesGraduate = !filters.graduateId || application.graduateId === filters.graduateId;
      const matchesOffer = !filters.offerId || application.offerId === filters.offerId;
      const matchesStatus = !filters.status || application.status === filters.status;
      return matchesGraduate && matchesOffer && matchesStatus;
    });
  },
  async getCompanies() {
    return mockAdminCompanies;
  },
  async getCompanyById(id: string) {
    return mockAdminCompanies.find((company) => company.id === id) ?? null;
  },
  async validateCompany(input: AdminCompanyValidationInput) {
    const company = mockAdminCompanies.find((item) => item.id === input.companyId);

    if (!company) {
      throw new Error("Empresa no encontrada");
    }

    company.estadoValidacion = input.decision;
    company.motivoRechazo = input.decision === companyValidationStatuses.rejected ? input.reason : undefined;
    company.validadoEn = new Date().toISOString();
    return company;
  },
  async getOffers() {
    return mockAdminOffers;
  },
  async getOfferById(id: string) {
    return mockAdminOffers.find((offer) => offer.id === id) ?? null;
  },
  async moderateOffer(input: AdminOfferModerationInput) {
    const offer = mockAdminOffers.find((item) => item.id === input.id);

    if (!offer) {
      throw new Error("Oferta no encontrada");
    }

    offer.estado = input.decision === "APROBAR" ? offerStatuses.active : offerStatuses.rejected;
    return offer;
  },
  async getReports() {
    return mockAdminReports;
  },
  async requestReport(input: AdminReportRequestInput) {
    const report = {
      id: `report-${Date.now()}`,
      type: input.type,
      status: reportStatuses.pending,
      createdAt: new Date().toISOString(),
      fileName: null,
      parameters: input.parameters ?? null,
      downloadUrl: null,
      errorMessage: null,
    };

    mockAdminReports.unshift(report);
    return report;
  },
  async retryReport(id: string) {
    const report = mockAdminReports.find((item) => item.id === id);

    if (!report) {
      throw new Error("Reporte no encontrado");
    }

    report.status = reportStatuses.processing;
    report.fileName = null;
    report.errorMessage = null;
    report.downloadUrl = null;
    return report;
  },
  async downloadReport(id: string) {
    const report = mockAdminReports.find((item) => item.id === id);

    if (!report) {
      throw new Error("Reporte no encontrado");
    }

    if (report.status !== reportStatuses.completed || !report.downloadUrl) {
      throw new Error("El reporte todavía no está disponible para descarga.");
    }

    return report.downloadUrl;
  },
  async getSkills() {
    return mockAdminSkills;
  },
  async createSkill(input: AdminSkillCreateInput) {
    const skill = {
      id: `skill-${Date.now()}`,
      name: input.name,
      type: input.type,
      category: input.category,
      isActive: true,
      usageInGraduates: 0,
      usageInOffers: 0,
    };

    mockAdminSkills.unshift(skill);
    return skill;
  },
  async updateSkill(input: AdminSkillUpdateInput) {
    const skill = mockAdminSkills.find((item) => item.id === input.id);

    if (!skill) {
      throw new Error("Habilidad no encontrada");
    }

    skill.name = input.name ?? skill.name;
    skill.type = input.type ?? skill.type;
    skill.category = input.category ?? skill.category;
    return skill;
  },
  async deleteSkill(id: string) {
    const index = mockAdminSkills.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error("Habilidad no encontrada");
    }

    mockAdminSkills.splice(index, 1);
  },
};
