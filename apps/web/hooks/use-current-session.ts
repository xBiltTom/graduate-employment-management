"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services";
import type { AuthSession } from "@/types";

export function useCurrentSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;

    authService
      .me()
      .then((result) => {
        if (mounted) {
          setSession(result);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setSession(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    session,
    isLoading,
    error,
    isAuthenticated: Boolean(session?.user),
  };
}
