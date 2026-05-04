import { contractTypes, offerModalities, offerStatuses } from "@/lib/constants";

export type OfferStatus = (typeof offerStatuses)[keyof typeof offerStatuses];
export type OfferModality = (typeof offerModalities)[keyof typeof offerModalities];
export type ContractType = (typeof contractTypes)[keyof typeof contractTypes];

export type JobSummary = {
  id: string;
  title: string;
  company: string;
  location: string;
  modality: OfferModality;
  contractType: ContractType;
  salaryRange?: string;
  skills: string[];
  match: number;
  status: OfferStatus;
  description: string;
  requirements: string[];
  publishedDate: string;
  closingDate: string;
};

export type PublicStat = {
  label: string;
  value: string;
};
