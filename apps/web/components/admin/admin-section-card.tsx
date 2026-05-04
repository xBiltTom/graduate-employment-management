import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-[var(--color-border-subtle)] shadow-sm">
      <CardHeader>
        <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">{title}</CardTitle>
        {description ? <p className="text-sm text-[var(--color-text-muted)]">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
