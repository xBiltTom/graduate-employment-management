"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrentSession } from "@/hooks/use-current-session";
import { LogoutButton } from "@/components/auth/logout-button";

export function UserMenu({
  profileHref,
  triggerClassName,
}: {
  profileHref?: string;
  triggerClassName?: string;
}) {
  const { session } = useCurrentSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className={triggerClassName}><User className="h-5 w-5" /></Button>} />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-text-heading)]">{session?.user.email ?? "Sesión activa"}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{session?.user.role ?? "Modo mock"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profileHref ? (
          <DropdownMenuItem render={<Link href={profileHref} className="w-full" />}>Mi perfil</DropdownMenuItem>
        ) : null}
        <DropdownMenuItem closeOnClick={false} className="p-0">
          <LogoutButton variant="ghost" size="sm" className="h-9 w-full justify-start rounded-md px-2 text-sm" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
