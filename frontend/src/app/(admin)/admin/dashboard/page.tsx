"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { analyticsApi, schoolApi, usersApi, classApi } from "@/lib/api";
import { Star, Users, BarChart2, BookOpen, ArrowRight, TrendingUp, Shield } from "lucide-react";

interface PlatformStats { schools: number; users: number; classes: number; avgScore: number; }

const adminSections = [
  { href: "/admin/schools",    label: "Schools",    icon: Star,      desc: "Manage registered schools",   gradient: "from-sky-500 to-indigo-600",    bg: "from-sky-50 to-indigo-50",    ring: "ring-sky-100" },
  { href: "/admin/users",      label: "Users",      icon: Users,     desc: "View all user accounts",      gradient: "from-rose-500 to-pink-600",     bg: "from-rose-50 to-pink-50",     ring: "ring-rose-100" },
  { href: "/admin/curriculum", label: "Curriculum", icon: BookOpen,  desc: "Browse all content",          gradient: "from-emerald-500 to-teal-600",  bg: "from-emerald-50 to-teal-50",  ring: "ring-emerald-100" },
  { href: "/admin/analytics",  label: "Analytics",  icon: BarChart2, desc: "Platform performance",        gradient: "from-violet-500 to-purple-600", bg: "from-violet-50 to-purple-50", ring: "ring-violet-100" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    Promise.all([
      schoolApi.list({ page_size: 1 }),
      usersApi.list({ page_size: 1 }),
      classApi.list(),
      analyticsApi.teacherDashboard(),
    ]).then(([schoolRes, userRes, classRes, analyticsRes]) => {
      const classData = classRes.data.results ?? classRes.data;
      setStats({
        schools: schoolRes.data.count ?? 0,
        users: userRes.data.count ?? 0,
        classes: Array.isArray(classData) ? classData.length : (classRes.data.count ?? 0),
        avgScore: analyticsRes.data.avg_score ?? 0,
      });
    }).catch(() => {});
  }, []);

  const statCards = stats
    ? [
        { label: "Schools",   value: stats.schools,           sub: "registered", icon: Star,       gradient: "from-sky-500 to-indigo-600",    bg: "from-sky-50 to-indigo-50",    ring: "ring-sky-100" },
        { label: "Users",     value: stats.users,             sub: "total",      icon: Users,      gradient: "from-rose-500 to-pink-600",     bg: "from-rose-50 to-pink-50",     ring: "ring-rose-100" },
        { label: "Classes",   value: stats.classes,           sub: "active",     icon: BookOpen,   gradient: "from-amber-400 to-orange-500",  bg: "from-amber-50 to-orange-50",  ring: "ring-amber-100" },
        { label: "Avg Score", value: `${stats.avgScore}%`,    sub: "platform",   icon: TrendingUp, gradient: "from-violet-500 to-purple-600", bg: "from-violet-50 to-purple-50", ring: "ring-violet-100" },
      ]
    : [];

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-800 to-violet-900 p-8 text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-violet-400/15" />
          <div className="absolute top-5 right-44 w-6 h-6 rounded-full bg-white/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Platform Control</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/60 text-sm max-w-lg">
              Manage schools, users, and curriculum. Monitor platform-wide performance.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        {statCards.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, sub, icon: Icon, gradient, bg, ring }) => (
              <div key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg} border border-white ring-1 ${ring} p-5 group hover:-translate-y-0.5 transition-all duration-200`}>
                <div className="pointer-events-none absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/40" />
                <div className="pointer-events-none absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/30" />
                <div className="pointer-events-none absolute top-1/2 right-5 w-7 h-7 rounded-full bg-white/20" />
                <div className={`relative inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} items-center justify-center mb-4 shadow-sm`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="relative font-display font-extrabold text-2xl text-gray-900 leading-none">
                  {value}<span className="text-sm font-normal text-gray-400 ml-1">{sub}</span>
                </p>
                <p className="relative text-xs text-gray-500 font-medium mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32" />)}
          </div>
        )}

        {/* Navigation cards */}
        <div>
          <h2 className="font-display font-bold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminSections.map(({ href, label, icon: Icon, desc, gradient, bg, ring }) => (
              <Link key={href} href={href}>
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg} border border-white ring-1 ${ring} p-5 group hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 h-full`}>
                  <div className="pointer-events-none absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/40" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/30" />
                  <div className={`relative inline-flex w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} items-center justify-center mb-4 shadow-sm`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="relative font-display font-bold text-gray-900 mb-1">{label}</h3>
                  <p className="relative text-sm text-gray-500">{desc}</p>
                  <div className="relative flex items-center gap-1 mt-4 text-xs font-semibold text-gray-500 group-hover:text-brand-600 transition-colors">
                    Manage <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
