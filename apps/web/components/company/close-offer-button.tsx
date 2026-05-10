"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { companyService } from "@/services";

type CloseOfferButtonProps = {
  offerId: string;
  disabled?: boolean;
};

export function CloseOfferButton({ offerId, disabled = false }: CloseOfferButtonProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = async () => {
    try {
      setIsClosing(true);
      await companyService.closeOffer(offerId);
      toast.success("Oferta cerrada correctamente.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="border-[var(--color-border-subtle)]"
      onClick={() => void handleClose()}
      disabled={disabled || isClosing}
    >
      {isClosing ? "Cerrando..." : "Cerrar"}
    </Button>
  );
}
