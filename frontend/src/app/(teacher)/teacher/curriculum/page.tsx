"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { curriculumApi } from "@/lib/api";
import type { Subject } from "@/types";
import { BookOpen, Layers } from "lucide-react";

const subjectGradients = [
  { bar: "from-brand-500 to-brand-700",     icon: "from-brand-500 to-brand-700",     bg: "from-brand-50/70 to-indigo-50/50",   ring: "ring-brand-100",   count: "bg-brand-100 text-brand-700" },
  { bar: "from-emerald-500 to-teal-600",    icon: "from-emerald-500 to-teal-600",    bg: "from-emerald-50/70 to-teal-50/50",  ring: "ring-emerald-100", count: "bg-emerald-100 text-emerald-700" },
  { bar: "from-amber-400 to-orange-500",    icon: "from-amber-400 to-orange-500",    bg: "from-amber-50/70 to-orange-50/50",  ring: "ring-amber-100",   count: "bg-amber-100 text-amber-700" },
  { bar: "from-violet-500 to-purple-600",   icon: "from-violet-500 to-purple-600",   bg: "from-violet-50/70 to-purple-50/50", ring: "ring-violet-100",  count: "bg-violet-100 text-violet-700" },
  { bar: "from-rose-500 to-pink-600",       icon: "from-rose-500 to-pink-600",       bg: "from-rose-50/70 to-pink-50/50",     ring: "ring-rose-100",    count: "bg-rose-100 text-rose-700" },
  { bar: "from-cyan-500 to-sky-600",        icon: "from-cyan-500 to-sky-600",        bg: "from-cyan-50/70 to-sky-50/50",      ring: "ring-cyan-100",    count: "bg-cyan-100 text-cyan-700" },
];

export default function TeacherCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    curriculumApi.subjects().then((r) => {
      setSubjects(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-brand-800 to-teal-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 w-28 h-28 rounded-full bg-emerald-400/15" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Content Overview</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Curriculum Overview</h1>
            <p className="text-white/60 text-sm max-w-lg">All published subjects and lessons available to students.</p>
            {!loading && (
              <span className="inline-block mt-4 text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {subjects.length} Subjects
              </span>
            )}
          </div>
        </div>

        {/* Subject cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-36" />)}
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-emerald-300" />
            </div>
            <p className="text-gray-400 font-medium">No curriculum content yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((s, idx) => {
              const g = subjectGradients[idx % subjectGradients.length];
              return (
                <div
                  key={s.id}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${g.bg} border border-white ring-1 ${g.ring} p-5 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200`}
                >
                  <div className="pointer-events-none absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/50" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/40" />
                  <div className={`relative inline-flex w-11 h-11 rounded-xl bg-gradient-to-br ${g.icon} items-center justify-center mb-4 shadow-sm`}>
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <h3 className="relative font-display font-bold text-gray-900 text-base mb-1">{s.name}</h3>
                  {s.description && (
                    <p className="relative text-sm text-gray-500 line-clamp-2 mb-3">{s.description}</p>
                  )}
                  <div className="relative flex items-center gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${g.count}`}>
                      <Layers size={10} />{s.topic_count} topics
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-sm text-gray-400">
          Manage full curriculum content via the{" "}
          <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline font-medium">Django Admin panel</a>.
        </p>
      </div>
    </DashboardLayout>
  );
}
