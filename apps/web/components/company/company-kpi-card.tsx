import { Card, CardContent } from "@/components/ui/card";

export function CompanyKpiCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-[var(--color-border-subtle)] shadow-sm bg-white">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-light)] text-[var(--color-brand)]">
            {icon}
          </div>
        </div>
        <div>
          <p className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
