import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatScore(score: number | string | null) {
  if (score === null || score === undefined) return "—";
  return `${Number(score).toFixed(1)}%`;
}

export function roleLabel(role: string) {
  const map: Record<string, string> = {
    student: "Student",
    teacher: "Teacher",
    coach: "Coach",
    admin: "Administrator",
    super_admin: "Super Admin",
  };
  return map[role] ?? role;
}
