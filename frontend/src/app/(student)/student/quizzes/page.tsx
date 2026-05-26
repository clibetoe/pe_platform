"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { assessmentApi } from "@/lib/api";
import type { Assessment } from "@/types";
import { ClipboardList, Clock, Target, Zap, ChevronRight } from "lucide-react";

const cardAccents = [
  "from-brand-500 to-brand-700",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
];

export default function QuizzesPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentApi.list().then((r) => {
      setAssessments(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-brand-800 to-brand-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-32 w-28 h-28 rounded-full bg-violet-500/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <ClipboardList size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Knowledge Tests</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Quizzes</h1>
            <p className="text-white/60 text-sm max-w-lg">
              Test your knowledge and earn certificates. Every quiz passed brings you closer to mastery.
            </p>
            {!loading && (
              <span className="inline-block mt-4 text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {assessments.length} Quiz{assessments.length !== 1 ? "zes" : ""} Available
              </span>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56" />)}
          </div>
        ) : assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
              <ClipboardList size={28} className="text-violet-300" />
            </div>
            <p className="text-gray-400 font-medium">No quizzes available yet.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon — new quizzes are added regularly.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {assessments.map((a, idx) => {
              const accent = cardAccents[idx % cardAccents.length];
              return (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col group hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
                >
                  {/* Colored top strip */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Lesson label */}
                    {a.lesson_title && (
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 truncate">
                        {a.lesson_title}
                      </p>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-brand-700 transition-colors">
                      {a.title}
                    </h3>

                    {/* Description */}
                    {a.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{a.description}</p>
                    )}
                    {!a.description && <div className="flex-1" />}

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <ClipboardList size={11} />
                        {a.question_count} questions
                      </span>
                      {a.time_limit_minutes && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-100">
                          <Clock size={11} />
                          {a.time_limit_minutes} min
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1.5 rounded-lg border border-brand-100">
                        <Target size={11} />
                        Pass {a.pass_score}%
                      </span>
                    </div>

                    {/* CTA */}
                    <Link href={`/student/quiz/${a.id}`}>
                      <Button className="w-full group/btn" size="sm">
                        <Zap size={14} />
                        Start Quiz
                        <ChevronRight size={14} className="ml-auto opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
