import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

type GraduateStatusNoticeProps = {
  message: string;
  showLoginAction?: boolean;
};

export function GraduateStatusNotice({
  message,
  showLoginAction = false,
}: GraduateStatusNoticeProps) {
  return (
    <Card className="border-[var(--color-border-subtle)] border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">
            No se pudo cargar esta sección
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md">
            {message}
          </p>
        </div>
        {showLoginAction ? (
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">
              Ir a iniciar sesión
            </Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
