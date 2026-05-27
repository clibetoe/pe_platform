"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Logo from "@/components/brand/Logo";
import {
  BookOpen, LayoutDashboard, ClipboardList, Award,
  Users, BarChart2, Trophy, Star,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  tourId: string;
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const studentNav: NavItem[] = [
  { href: "/student/dashboard",    label: "Dashboard",    icon: LayoutDashboard, tourId: "nav-dashboard"    },
  { href: "/student/curriculum",   label: "Curriculum",   icon: BookOpen,        tourId: "nav-curriculum"   },
  { href: "/student/quizzes",      label: "Quizzes",      icon: ClipboardList,   tourId: "nav-quizzes"      },
  { href: "/student/certificates", label: "Certificates", icon: Award,           tourId: "nav-certificates" },
  { href: "/student/achievements", label: "Achievements", icon: Trophy,          tourId: "nav-achievements" },
];

const teacherNav: NavItem[] = [
  { href: "/teacher/dashboard",   label: "Dashboard",   icon: LayoutDashboard, tourId: "nav-dashboard"   },
  { href: "/teacher/classes",     label: "My Classes",  icon: Users,           tourId: "nav-classes"     },
  { href: "/teacher/curriculum",  label: "Curriculum",  icon: BookOpen,        tourId: "nav-curriculum"  },
  { href: "/teacher/assessments", label: "Assessments", icon: ClipboardList,   tourId: "nav-assessments" },
  { href: "/teacher/analytics",   label: "Analytics",   icon: BarChart2,       tourId: "nav-analytics"   },
];

const adminNav: NavItem[] = [
  { href: "/admin/dashboard",  label: "Dashboard",  icon: LayoutDashboard, tourId: "nav-dashboard"  },
  { href: "/admin/schools",    label: "Schools",    icon: Star,            tourId: "nav-schools"    },
  { href: "/admin/users",      label: "Users",      icon: Users,           tourId: "nav-users"      },
  { href: "/admin/curriculum", label: "Curriculum", icon: BookOpen,        tourId: "nav-curriculum" },
  { href: "/admin/analytics",  label: "Analytics",  icon: BarChart2,       tourId: "nav-analytics"  },
];

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { user, isRole } = useAuth();
  const pathname = usePathname();

  const nav = isRole("admin", "super_admin")
    ? adminNav
    : isRole("teacher", "coach")
    ? teacherNav
    : studentNav;

  return (
    <>
      <aside data-tour="sidebar" className="hidden lg:flex lg:w-64 min-h-screen bg-gradient-to-b from-brand-900 to-brand-950 text-white flex-col flex-shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div>
            {/* Desktop logo uses PDF asset with graceful fallback */}
            <Logo />
          </div>
        </div>

        <div className="mx-5 h-px bg-white/8 mb-3" />

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {nav.map(({ href, label, icon: Icon, tourId }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                data-tour={tourId}
                className={cn(
                  "nav-link",
                  active ? "nav-link-active" : "nav-link-inactive"
                )}
              >
                <Icon
                  size={17}
                  className={active ? "text-white" : "text-white/45"}
                />
                <span className={active ? "text-white font-semibold" : "text-white/65"}>
                  {label}
                </span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User strip */}
        {user && (
          <div data-tour="user-strip" className="px-3 pb-5">
            <div className="mx-2 h-px bg-white/8 mb-4" />
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate leading-none">{user.full_name}</p>
                <p className="text-xs text-white/35 capitalize mt-0.5">{user.role.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation drawer"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 h-full w-[82vw] max-w-xs bg-gradient-to-b from-brand-900 to-brand-950 text-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
              <div onClick={onMobileClose}>
                <Logo compact />
              </div>
              <button
                type="button"
                onClick={onMobileClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close navigation drawer"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="mx-5 h-px bg-white/8 mb-3" />

            <nav className="px-3 py-2 space-y-0.5">
              {nav.map(({ href, label, icon: Icon, tourId }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    data-tour={tourId}
                    onClick={onMobileClose}
                    className={cn(
                      "nav-link",
                      active ? "nav-link-active" : "nav-link-inactive"
                    )}
                  >
                    <Icon
                      size={17}
                      className={active ? "text-white" : "text-white/45"}
                    />
                    <span className={active ? "text-white font-semibold" : "text-white/65"}>
                      {label}
                    </span>
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {user && (
              <div data-tour="user-strip" className="px-3 pb-5 pt-2">
                <div className="mx-2 h-px bg-white/8 mb-4" />
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate leading-none">{user.full_name}</p>
                    <p className="text-xs text-white/35 capitalize mt-0.5">{user.role.replace("_", " ")}</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
