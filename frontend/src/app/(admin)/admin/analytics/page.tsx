"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressBar } from "@/components/ui/Progress";
import { analyticsApi, schoolApi, usersApi } from "@/lib/api";
import type { TeacherDashboard } from "@/types";
import { Users, BookOpen, TrendingUp, Award, BarChart2, Star } from "lucide-react";

interface PlatformMeta { schools: number; users: number; }

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TeacherDashboard | null>(null);
  const [meta, setMeta] = useState<PlatformMeta | null>(null);

  useEffect(() => {
    Promise.all([
      analyticsApi.teacherDashboard(),
      schoolApi.list({ page_size: 1 }),
      usersApi.list({ page_size: 1 }),
    ]).then(([analyticsRes, schoolRes, userRes]) => {
      setAnalytics(analyticsRes.data);
      setMeta({ schools: schoolRes.data.count ?? 0, users: userRes.data.count ?? 0 });
    });
  }, []);

  const loading = !analytics || !meta;

  const statCards = analytics && meta
    ? [
        { label: "Schools",    value: meta.schools,             sub: "registered", icon: Star,       gradient: "from-sky-500 to-indigo-600",    bg: "from-sky-50 to-indigo-50",    ring: "ring-sky-100" },
        { label: "Total Users",value: meta.users,               sub: "total",      icon: Users,      gradient: "from-emerald-500 to-teal-600",  bg: "from-emerald-50 to-teal-50",  ring: "ring-emerald-100" },
        { label: "Avg Score",  value: `${analytics.avg_score}%`,sub: "overall",    icon: TrendingUp, gradient: "from-amber-400 to-orange-500",  bg: "from-amber-50 to-orange-50",  ring: "ring-amber-100" },
        { label: "Pass Rate",  value: `${analytics.pass_rate}%`,sub: "overall",    icon: Award,      gradient: "from-violet-500 to-purple-600", bg: "from-violet-50 to-purple-50", ring: "ring-violet-100" },
      ]
    : [];

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-800 to-teal-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-20 w-28 h-28 rounded-full bg-teal-400/15" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <BarChart2 size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Platform Insights</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Analytics</h1>
            <p className="text-white/60 text-sm max-w-lg">Platform-wide performance overview and class metrics.</p>
          </div>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32" />)}
          </div>
        ) : (
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
        )}

        {/* Class performance + platform summary */}
        {analytics && (
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Class performance */}
            <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
              <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-teal-400/[0.06]" />
              <div className="pointer-events-none absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-brand-400/[0.07]" />
              <div className="relative z-10 px-6 py-4 border-b border-gray-50">
                <h2 className="font-display font-bold text-gray-900">Class Performance</h2>
              </div>
              <div className="relative z-10 p-6 space-y-4">
                {analytics.classes.length === 0 ? (
                  <p className="text-sm text-gray-400">No classes found.</p>
                ) : analytics.classes.map((klass) => (
                  <div key={klass.id} className="p-4 bg-gradient-to-r from-gray-50/80 to-teal-50/30 rounded-xl border border-gray-100">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-900">{klass.name}</span>
                      <span className="font-bold text-brand-600">{klass.avg_score}%</span>
                    </div>
                    <ProgressBar value={klass.avg_score} max={100} />
                    <p className="text-xs text-gray-400 mt-2">{klass.student_count} students · {klass.completed_lessons} lessons</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform summary */}
            <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
              <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-violet-400/[0.06]" />
              <div className="pointer-events-none absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-brand-400/[0.07]" />
              <div className="relative z-10 px-6 py-4 border-b border-gray-50">
                <h2 className="font-display font-bold text-gray-900">Platform Summary</h2>
              </div>
              <div className="relative z-10 p-6 space-y-2">
                {[
                  { label: "Total Students",     value: analytics.total_students,    icon: Users,      color: "from-brand-500 to-brand-700" },
                  { label: "Total Classes",      value: analytics.total_classes,     icon: BarChart2,  color: "from-emerald-500 to-teal-600" },
                  { label: "Lessons Completed",  value: analytics.completed_lessons, icon: BookOpen,   color: "from-amber-400 to-orange-500" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </div>
                    <span className="font-display font-bold text-gray-900 text-lg">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {loading && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="skeleton h-64" />
            <div className="skeleton h-64" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
