"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export function useTour() {
  const { user } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    try {
      const key = `pe_tour_${user.id}`;
      if (!localStorage.getItem(key)) {
        setShouldShow(true);
      }
    } catch {
      setShouldShow(false);
    }
  }, [user]);

  const markDone = () => {
    if (!user) return;
    try {
      localStorage.setItem(`pe_tour_${user.id}`, "1");
    } catch {
      // Ignore storage failures and keep the tour from blocking the UI.
    }
    setShouldShow(false);
  };

  return { shouldShow, markDone };
}
