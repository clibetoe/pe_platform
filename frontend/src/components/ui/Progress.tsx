import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "blue" | "green" | "orange";
}

export function ProgressBar({ value, max = 100, className, color = "blue" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors = {
    blue: "bg-brand-600",
    green: "bg-green-500",
    orange: "bg-orange-500",
  };
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
      <div
        className={cn("h-2 rounded-full transition-all duration-500", colors[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
