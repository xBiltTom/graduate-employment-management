import { CompanyLayout } from '@/components/layout/company-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CompanyLayout>{children}</CompanyLayout>;
}
