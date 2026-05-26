"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { assessmentApi } from "@/lib/api";
import type { Assessment } from "@/types";
import { ClipboardList, Target, CheckCircle, Clock } from "lucide-react";

const cardAccents = [
  "from-brand-500 to-brand-700",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
];

export default function TeacherAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentApi.list().then((r) => {
      setAssessments(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-brand-800 to-brand-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-32 w-28 h-28 rounded-full bg-violet-500/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <ClipboardList size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Assessment Library</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Assessments</h1>
            <p className="text-white/60 text-sm max-w-lg">
              All quizzes available on the platform. Manage and monitor student performance.
            </p>
            {!loading && (
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {assessments.length} Assessments
                </span>
                <span className="text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {assessments.filter(a => a.is_published).length} Published
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48" />)}
          </div>
        ) : assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
              <ClipboardList size={28} className="text-violet-300" />
            </div>
            <p className="text-gray-400 font-medium">No assessments available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {assessments.map((a, idx) => {
              const accent = cardAccents[idx % cardAccents.length];
              return (
                <div key={a.id} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />
                  <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-400/[0.05]" />
                  <div className="pointer-events-none absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-accent-400/[0.06]" />
                  <div className="relative z-10 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        {a.lesson_title && (
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 truncate">{a.lesson_title}</p>
                        )}
                        <h3 className="font-display font-bold text-gray-900">{a.title}</h3>
                      </div>
                      <Badge variant={a.is_published ? "success" : "warning"} className="flex-shrink-0">
                        {a.is_published ? <CheckCircle size={10} className="mr-1" /> : null}
                        {a.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <ClipboardList size={11} />{a.question_count} questions
                      </span>
                      {a.time_limit_minutes && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-100">
                          <Clock size={11} />{a.time_limit_minutes} min
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1.5 rounded-lg border border-brand-100">
                        <Target size={11} />Pass {a.pass_score}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-sm text-gray-400">
          Create and edit assessments via the{" "}
          <a href="http://localhost:8000/admin/" target="_blank" className="text-brand-600 hover:underline font-medium">Django Admin panel</a>.
        </p>
      </div>
    </DashboardLayout>
  );
}
