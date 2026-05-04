import { Card, CardContent } from "@/components/ui/card";

export function AdminKpiCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-[var(--color-border-subtle)] shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
            <p className="mt-3 font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{value}</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{description}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-brand-light)] text-[var(--color-brand)]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
