"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  BookOpen, LayoutDashboard, ClipboardList, Award,
  Users, BarChart2, LogOut, Trophy, Star,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const studentNav: NavItem[] = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/student/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/student/certificates", label: "Certificates", icon: Award },
  { href: "/student/achievements", label: "Achievements", icon: Trophy },
];

const teacherNav: NavItem[] = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "My Classes", icon: Users },
  { href: "/teacher/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/teacher/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/teacher/analytics", label: "Analytics", icon: BarChart2 },
];

const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schools", label: "Schools", icon: Star },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
];

export function Sidebar() {
  const { user, logout, isRole } = useAuth();
  const pathname = usePathname();

  const nav = isRole("admin", "super_admin")
    ? adminNav
    : isRole("teacher", "coach")
    ? teacherNav
    : studentNav;

  return (
    <aside className="w-64 min-h-screen bg-brand-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-brand-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-sm">PE</div>
          <div>
            <p className="font-bold text-sm leading-none">PE Platform</p>
            <p className="text-xs text-brand-300 mt-0.5">Olympic Values</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="px-6 py-4 border-b border-brand-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold uppercase">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.full_name}</p>
              <p className="text-xs text-brand-300 capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-brand-600 text-white"
                : "text-brand-200 hover:bg-brand-800 hover:text-white"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-brand-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-brand-200 hover:bg-brand-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
