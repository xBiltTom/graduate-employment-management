"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/hooks/use-auth-actions";

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
  showLabel = true,
}: {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  className?: string;
  showLabel?: boolean;
}) {
  const { logout } = useAuthActions();

  return (
    <Button variant={variant} size={size} className={className} onClick={() => void logout()}>
      <LogOut className="h-4 w-4" />
      {showLabel ? <span className="ml-2">Cerrar sesión</span> : null}
    </Button>
  );
}
