"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { companyValidationStatuses } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminCompanyValidationInput } from "@/types";

type ValidateCompanyActionProps = {
  companyId: string;
  decision: AdminCompanyValidationInput["decision"];
  label: string;
  variant?: "default" | "outline";
  className?: string;
  disabled?: boolean;
};

export function ValidateCompanyAction({
  companyId,
  decision,
  label,
  variant = "outline",
  className,
  disabled = false,
}: ValidateCompanyActionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    try {
      const reason =
        decision === companyValidationStatuses.rejected
          ? window.prompt("Ingresa el motivo del rechazo")?.trim()
          : undefined;

      if (decision === companyValidationStatuses.rejected && !reason) {
        toast.info("Debes indicar un motivo para rechazar la empresa.");
        return;
      }

      setIsSubmitting(true);
      await adminService.validateCompany({
        companyId,
        decision,
        reason,
      });
      toast.success("Estado de empresa actualizado.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => void handleClick()}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? "Actualizando..." : label}
    </Button>
  );
}
