"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminOfferModerationInput } from "@/types";

type ModerateOfferActionProps = {
  offerId: string;
  decision: AdminOfferModerationInput["decision"];
  label: string;
  variant?: "default" | "outline";
  className?: string;
  disabled?: boolean;
};

export function ModerateOfferAction({
  offerId,
  decision,
  label,
  variant = "outline",
  className,
  disabled = false,
}: ModerateOfferActionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    try {
      const reason =
        decision === "RECHAZAR"
          ? window.prompt("Ingresa el motivo del rechazo")?.trim()
          : undefined;

      if (decision === "RECHAZAR" && !reason) {
        toast.info("Debes indicar un motivo para rechazar la oferta.");
        return;
      }

      setIsSubmitting(true);
      await adminService.moderateOffer({
        id: offerId,
        decision,
        reason,
      });
      toast.success("Moderación de oferta actualizada.");
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
