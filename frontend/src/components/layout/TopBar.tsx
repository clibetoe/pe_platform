"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Bell, ChevronDown, LogOut } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  curriculum: "Curriculum",
  quizzes: "Quizzes",
  certificates: "Certificates",
  achievements: "Achievements",
  classes: "My Classes",
  assessments: "Assessments",
  analytics: "Analytics",
  schools: "Schools",
  users: "Users",
};

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "dashboard";
  return routeLabels[last] ?? (last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " "));
}

export function TopBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  if (!user) return null;

  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();

  return (
    <header className="h-16 bg-gradient-to-r from-brand-950 to-brand-900 topbar-glow flex items-center px-6 gap-4 flex-shrink-0 relative">
      {/* Subtle accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />

      <h1 className="font-display font-bold text-xl text-white/90 flex-1 tracking-tight">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white/90 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-400 border-2 border-brand-900" />
        </button>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ring-2 ring-white/10">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-white/90 leading-none">{user.full_name}</p>
              <p className="text-xs text-white/40 capitalize mt-0.5">{user.role.replace("_", " ")}</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-floating border border-gray-100/80 py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
              </div>
              <div className="py-1.5">
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
