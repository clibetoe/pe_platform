"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export function useTour() {
  const { user } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    const key = `pe_tour_${user.id}`;
    if (!localStorage.getItem(key)) {
      setShouldShow(true);
    }
  }, [user]);

  const markDone = () => {
    if (!user) return;
    localStorage.setItem(`pe_tour_${user.id}`, "1");
    setShouldShow(false);
  };

  return { shouldShow, markDone };
}
