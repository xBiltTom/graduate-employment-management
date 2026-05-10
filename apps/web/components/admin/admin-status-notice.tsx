import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

type AdminStatusNoticeProps = {
  message: string;
  showLoginAction?: boolean;
};

export function AdminStatusNotice({
  message,
  showLoginAction = false,
}: AdminStatusNoticeProps) {
  return (
    <Card className="border-[var(--color-border-subtle)] border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">
            No se pudo cargar esta sección administrativa
          </h2>
          <p className="max-w-md text-sm text-[var(--color-text-muted)]">{message}</p>
        </div>
        {showLoginAction ? (
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]">
              Ir a iniciar sesión
            </Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
