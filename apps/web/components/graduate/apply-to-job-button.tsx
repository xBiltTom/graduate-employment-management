"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { graduateService } from "@/services";

type ApplyToJobButtonProps = {
  jobId: string;
  className?: string;
};

export function ApplyToJobButton({
  jobId,
  className,
}: ApplyToJobButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleApply() {
    try {
      setIsSubmitting(true);
      await graduateService.applyToJob(jobId);
      toast.success("Postulación enviada correctamente");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button onClick={handleApply} disabled={isSubmitting} className={className}>
      {isSubmitting ? "Postulando..." : "Postular ahora"}
    </Button>
  );
}
