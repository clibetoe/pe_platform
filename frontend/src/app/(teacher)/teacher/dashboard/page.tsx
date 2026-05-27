"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { analyticsApi } from "@/lib/api";
import type { TeacherDashboard } from "@/types";
import { useAuth } from "@/lib/auth";
import { Users, BookOpen, Award, TrendingUp, ChevronRight } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<TeacherDashboard | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    analyticsApi.teacherDashboard()
      .then((r) => {
        if (active) setData(r.data);
      })
      .catch(() => {
        if (active) setData(null);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const statCards = data
    ? [
        { label: "Total Students", value: data.total_students,       sub: "enrolled",  icon: Users,      gradient: "from-brand-500 to-brand-700",      bg: "from-brand-50 to-indigo-50",    ring: "ring-brand-100" },
        { label: "Classes",        value: data.total_classes,        sub: "active",    icon: BookOpen,   gradient: "from-emerald-500 to-teal-600",     bg: "from-emerald-50 to-teal-50",    ring: "ring-emerald-100" },
        { label: "Avg Quiz Score", value: `${data.avg_score}%`,      sub: "overall",   icon: Award,      gradient: "from-amber-400 to-orange-500",     bg: "from-amber-50 to-orange-50",    ring: "ring-amber-100" },
        { label: "Pass Rate",      value: `${data.pass_rate}%`,      sub: "overall",   icon: TrendingUp, gradient: "from-violet-500 to-purple-600",    bg: "from-violet-50 to-purple-50",   ring: "ring-violet-100" },
      ]
    : [];

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-800 to-brand-900 p-8 text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-emerald-400/15" />
          <div className="absolute top-6 right-48 w-6 h-6 rounded-full bg-white/20" />
          <div className="relative z-10">
            <p className="text-white/60 text-sm font-medium mb-1">{getGreeting()},</p>
            <h1 className="font-display font-extrabold text-3xl text-white leading-tight mb-2">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-white/65 text-sm">
              Here&apos;s an overview of your classes and student progress.
            </p>
            {data && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">{data.total_students} Students</span>
                <span className="text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">{data.total_classes} Classes</span>
              </div>
            )}
          </div>
        </div>

        {/* Stat cards */}
        {loaded && statCards.length > 0 ? (
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
        ) : !loaded ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32" />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-6 text-sm text-gray-500">
            Teacher analytics are unavailable right now. Your dashboard shell is still ready.
          </div>
        )}

        {/* Classes card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
          <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-400/[0.06]" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-brand-400/[0.07]" />
          <div className="pointer-events-none absolute top-8 right-1/3 w-12 h-12 rounded-full bg-teal-400/[0.05]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-display font-bold text-gray-900">My Classes</h2>
              <Link href="/teacher/classes" className="flex items-center gap-1 text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                Manage classes <ChevronRight size={13} />
              </Link>
            </div>
            <div className="p-6">
              {!data ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
              ) : data.classes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <Users size={20} className="text-emerald-400" />
                  </div>
                  <p className="text-sm text-gray-400">No classes yet.</p>
                  <Link href="/teacher/classes" className="text-sm text-brand-600 font-semibold hover:underline mt-1 inline-block">Create your first class →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.classes.map((klass) => (
                    <div key={klass.id} className="relative overflow-hidden p-4 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-xl border border-gray-100 hover:border-emerald-100 transition-colors">
                      <div className="pointer-events-none absolute -top-3 -right-3 w-14 h-14 rounded-full bg-white/60" />
                      <div className="pointer-events-none absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-white/50" />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                          <Users size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">{klass.name}</p>
                            <Badge variant="info">{klass.student_count} students</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span>Avg Score: <strong className="text-gray-900">{klass.avg_score}%</strong></span>
                            <span>Lessons done: <strong className="text-gray-900">{klass.completed_lessons}</strong></span>
                          </div>
                          <ProgressBar value={klass.avg_score} max={100} />
                        </div>
                        <Link href={`/teacher/classes/${klass.id}`} className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex-shrink-0 flex items-center gap-1">
                          View <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
