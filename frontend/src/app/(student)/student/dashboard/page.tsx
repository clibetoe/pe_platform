"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { analyticsApi, assessmentApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { MyStats, Attempt, Certificate } from "@/types";
import { BookOpen, Award, ClipboardCheck, Zap, TrendingUp, ChevronRight, Star } from "lucide-react";
import { formatDate, formatScore } from "@/lib/utils";
import Link from "next/link";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MyStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    analyticsApi.myStats().then((r) => setStats(r.data));
    assessmentApi.attempts().then((r) => setRecentAttempts(r.data.results?.slice(0, 5) ?? []));
    assessmentApi.certificates().then((r) => setCerts(r.data.results ?? []));
  }, []);

  const progressPct = stats
    ? Math.round((stats.lessons_completed / (stats.total_lessons || 1)) * 100)
    : 0;

  const statCards = stats
    ? [
        {
          label: "Lessons Done",
          value: `${stats.lessons_completed}`,
          sub: `of ${stats.total_lessons}`,
          icon: BookOpen,
          gradient: "from-brand-500 to-brand-600",
          bg: "from-brand-50 to-indigo-50",
          ring: "ring-brand-100",
        },
        {
          label: "Quizzes Passed",
          value: `${stats.quizzes_passed}`,
          sub: "total",
          icon: ClipboardCheck,
          gradient: "from-emerald-500 to-teal-600",
          bg: "from-emerald-50 to-teal-50",
          ring: "ring-emerald-100",
        },
        {
          label: "Avg. Score",
          value: formatScore(stats.avg_score),
          sub: "overall",
          icon: TrendingUp,
          gradient: "from-amber-400 to-orange-500",
          bg: "from-amber-50 to-orange-50",
          ring: "ring-amber-100",
        },
        {
          label: "XP Earned",
          value: `${stats.xp_total}`,
          sub: "points",
          icon: Zap,
          gradient: "from-violet-500 to-purple-600",
          bg: "from-violet-50 to-purple-50",
          ring: "ring-violet-100",
        },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 p-8 text-white">
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-accent-500/15" />
          <div className="absolute top-6 right-48 w-6 h-6 rounded-full bg-white/20" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-white/60 text-sm font-medium mb-1">{getGreeting()},</p>
              <h1 className="font-display font-extrabold text-3xl text-white leading-tight mb-2">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-white/65 text-sm max-w-sm">
                Keep pushing — you&apos;re {progressPct}% through your curriculum. Every lesson counts.
              </p>
            </div>

            {stats && (
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <span className="font-display font-extrabold text-4xl text-white leading-none">{progressPct}%</span>
                <span className="text-white/55 text-xs mt-1.5 font-medium">Complete</span>
              </div>
            )}
          </div>

          {stats && (
            <div className="relative z-10 mt-6">
              <div className="flex justify-between text-xs text-white/50 mb-2">
                <span>Overall Progress</span>
                <span>{stats.lessons_completed} / {stats.total_lessons} lessons</span>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-300 transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stat Cards */}
        {statCards.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, sub, icon: Icon, gradient, bg, ring }) => (
              <div
                key={label}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg} border border-white ring-1 ${ring} p-5 group hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} items-center justify-center mb-4 shadow-sm`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="font-display font-extrabold text-2xl text-gray-900 leading-none">
                  {value}
                  <span className="text-sm font-normal text-gray-400 ml-1">{sub}</span>
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skeleton state */}
        {!stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-32" />
            ))}
          </div>
        )}

        {/* Bottom grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Recent Quiz Results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-display font-bold text-gray-900">Recent Quiz Results</h2>
              <Link href="/student/quizzes" className="flex items-center gap-1 text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentAttempts.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                    <ClipboardCheck size={20} className="text-brand-400" />
                  </div>
                  <p className="text-sm text-gray-400">No quizzes taken yet.</p>
                  <Link href="/student/quizzes" className="text-sm text-brand-600 font-semibold hover:underline mt-1 inline-block">
                    Start your first quiz →
                  </Link>
                </div>
              ) : (
                recentAttempts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{a.assessment_title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.submitted_at!)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className={`text-sm font-bold ${a.passed ? "text-emerald-600" : "text-red-500"}`}>
                        {formatScore(a.score)}
                      </span>
                      <Badge variant={a.passed ? "success" : "danger"}>
                        {a.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-display font-bold text-gray-900">My Certificates</h2>
              <Link href="/student/certificates" className="flex items-center gap-1 text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {certs.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                    <Award size={20} className="text-amber-400" />
                  </div>
                  <p className="text-sm text-gray-400">No certificates yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Pass a quiz to earn your first certificate!</p>
                </div>
              ) : (
                certs.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Star size={16} className="text-white fill-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.assessment_title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">#{c.certificate_number} · {formatDate(c.issued_at)}</p>
                    </div>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex-shrink-0">
                      Certified
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
