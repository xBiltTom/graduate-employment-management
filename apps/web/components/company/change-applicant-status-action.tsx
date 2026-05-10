"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { companyService } from "@/services";
import type { ApplicationStatus } from "@/types";

type ChangeApplicantStatusActionProps = {
  applicationId: string;
  nextStatus: ApplicationStatus;
  label: string;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
  disabled?: boolean;
  onStatusChanged?: (status: ApplicationStatus) => void;
};

export function ChangeApplicantStatusAction({
  applicationId,
  nextStatus,
  label,
  variant = "outline",
  size = "default",
  className,
  disabled = false,
  onStatusChanged,
}: ChangeApplicantStatusActionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    try {
      setIsSubmitting(true);
      const updated = await companyService.changeApplicantStatus({
        applicationId,
        status: nextStatus,
      });

      if (!updated) {
        throw new Error("No se pudo actualizar el estado del postulante.");
      }

      onStatusChanged?.(updated.status);
      toast.success("Estado del postulante actualizado.");
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
      size={size}
      className={className}
      onClick={() => void handleClick()}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? "Actualizando..." : label}
    </Button>
  );
}
