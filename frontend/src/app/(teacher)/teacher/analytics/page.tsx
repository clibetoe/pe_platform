"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressBar } from "@/components/ui/Progress";
import { analyticsApi } from "@/lib/api";
import type { TeacherDashboard } from "@/types";
import { BarChart2, Users, TrendingUp, Award, BookOpen } from "lucide-react";

export default function TeacherAnalyticsPage() {
  const [data, setData] = useState<TeacherDashboard | null>(null);

  useEffect(() => {
    analyticsApi.teacherDashboard().then((r) => setData(r.data));
  }, []);

  const statCards = data
    ? [
        { label: "Students",   value: data.total_students,  sub: "enrolled", icon: Users,      gradient: "from-brand-500 to-brand-700",     bg: "from-brand-50 to-indigo-50",   ring: "ring-brand-100" },
        { label: "Classes",    value: data.total_classes,   sub: "active",   icon: BookOpen,   gradient: "from-emerald-500 to-teal-600",    bg: "from-emerald-50 to-teal-50",   ring: "ring-emerald-100" },
        { label: "Avg Score",  value: `${data.avg_score}%`, sub: "overall",  icon: TrendingUp, gradient: "from-amber-400 to-orange-500",    bg: "from-amber-50 to-orange-50",   ring: "ring-amber-100" },
        { label: "Pass Rate",  value: `${data.pass_rate}%`, sub: "overall",  icon: Award,      gradient: "from-violet-500 to-purple-600",   bg: "from-violet-50 to-purple-50",  ring: "ring-violet-100" },
      ]
    : [];

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-teal-800 to-brand-900 p-8 text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-cyan-400/15" />
          <div className="absolute top-6 right-44 w-6 h-6 rounded-full bg-white/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <BarChart2 size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Performance Insights</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Analytics</h1>
            <p className="text-white/60 text-sm max-w-lg">
              Class and student performance metrics. Track progress across all your classes.
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

        {/* Class performance card */}
        {data && (
          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-cyan-400/[0.06]" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-brand-400/[0.07]" />
            <div className="pointer-events-none absolute top-10 right-1/3 w-12 h-12 rounded-full bg-teal-400/[0.05]" />
            <div className="relative z-10 px-6 py-4 border-b border-gray-50">
              <h2 className="font-display font-bold text-gray-900">Class Performance</h2>
            </div>
            <div className="relative z-10 p-6 space-y-5">
              {data.classes.length === 0 ? (
                <p className="text-sm text-gray-400">No classes found.</p>
              ) : (
                data.classes.map((klass) => (
                  <div key={klass.id} className="relative overflow-hidden p-4 bg-gradient-to-r from-gray-50/80 to-cyan-50/30 rounded-xl border border-gray-100">
                    <div className="pointer-events-none absolute -top-3 -right-3 w-14 h-14 rounded-full bg-white/60" />
                    <div className="pointer-events-none absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-white/50" />
                    <div className="relative z-10">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-900">{klass.name}</span>
                        <span className="font-bold text-brand-600">{klass.avg_score}%</span>
                      </div>
                      <ProgressBar value={klass.avg_score} max={100} />
                      <p className="text-xs text-gray-400 mt-2">
                        {klass.student_count} students · {klass.completed_lessons} lessons completed
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {!data && <div className="skeleton h-64" />}
      </div>
    </DashboardLayout>
  );
}
