"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { curriculumApi } from "@/lib/api";
import type { Subject, Topic } from "@/types";
import { BookOpen, Eye, EyeOff, Layers, ChevronDown } from "lucide-react";

const subjectGradients = [
  { bar: "from-brand-500 to-brand-700",     icon: "from-brand-500 to-brand-700",     bg: "from-brand-50 to-indigo-50/60",   ring: "ring-brand-200",   count: "bg-brand-100 text-brand-700" },
  { bar: "from-emerald-500 to-teal-600",    icon: "from-emerald-500 to-teal-600",    bg: "from-emerald-50 to-teal-50/60",  ring: "ring-emerald-200", count: "bg-emerald-100 text-emerald-700" },
  { bar: "from-amber-400 to-orange-500",    icon: "from-amber-400 to-orange-500",    bg: "from-amber-50 to-orange-50/60",  ring: "ring-amber-200",   count: "bg-amber-100 text-amber-700" },
  { bar: "from-violet-500 to-purple-600",   icon: "from-violet-500 to-purple-600",   bg: "from-violet-50 to-purple-50/60", ring: "ring-violet-200",  count: "bg-violet-100 text-violet-700" },
  { bar: "from-rose-500 to-pink-600",       icon: "from-rose-500 to-pink-600",       bg: "from-rose-50 to-pink-50/60",     ring: "ring-rose-200",    count: "bg-rose-100 text-rose-700" },
  { bar: "from-cyan-500 to-sky-600",        icon: "from-cyan-500 to-sky-600",        bg: "from-cyan-50 to-sky-50/60",      ring: "ring-cyan-200",    count: "bg-cyan-100 text-cyan-700" },
];

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-xl border border-gray-100 shadow-card">
      <div className="pointer-events-none absolute -top-4 -right-4 w-14 h-14 rounded-full bg-brand-400/[0.05]" />
      <div className="pointer-events-none absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-accent-400/[0.06]" />
      <div className="relative z-10 px-4 py-3 border-b border-gray-50 flex items-center gap-2">
        <Layers size={13} className="text-brand-500" />
        <span className="text-sm font-bold text-gray-800 truncate">{topic.title}</span>
      </div>
      <div className="relative z-10 divide-y divide-gray-50">
        {topic.lessons?.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between px-4 py-2.5 text-xs gap-2 hover:bg-gray-50/60 transition-colors">
            <span className="text-gray-700 truncate font-medium">{lesson.title}</span>
            {lesson.is_published ? (
              <Eye size={12} className="text-emerald-500 flex-shrink-0" />
            ) : (
              <EyeOff size={12} className="text-gray-300 flex-shrink-0" />
            )}
          </div>
        ))}
        {(!topic.lessons || topic.lessons.length === 0) && (
          <p className="text-xs text-gray-400 px-4 py-3">No lessons</p>
        )}
      </div>
      <div className="relative z-10 px-4 py-2 border-t border-gray-50">
        <p className="text-xs text-gray-400">{topic.lesson_count} lesson{topic.lesson_count !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}

function SubjectSection({ subject, idx }: { subject: Subject; idx: number }) {
  const [detail, setDetail] = useState<Subject | null>(null);
  const [expanded, setExpanded] = useState(false);
  const g = subjectGradients[idx % subjectGradients.length];

  const toggle = () => {
    setExpanded((v) => !v);
    if (!detail) {
      curriculumApi.subject(subject.id).then((r) => setDetail(r.data));
    }
  };

  return (
    <div className={`rounded-2xl border border-white ring-1 ${g.ring} overflow-hidden bg-gradient-to-br ${g.bg} shadow-card`}>
      <button onClick={toggle} className="w-full flex items-center gap-4 px-6 py-5 text-left">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${g.icon} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <BookOpen size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-gray-900 text-lg leading-tight">{subject.name}</h2>
          {subject.description && <p className="text-sm text-gray-500 mt-0.5 truncate">{subject.description}</p>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${g.count}`}>{subject.topic_count} topics</span>
          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/60 px-6 pb-6 pt-4">
          {!detail ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(Math.min(subject.topic_count, 3))].map((_, i) => <div key={i} className="skeleton h-28" />)}
            </div>
          ) : !detail.topics?.length ? (
            <p className="text-sm text-gray-400">No topics in this subject.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {detail.topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    curriculumApi.subjects().then((r) => {
      setSubjects(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout requiredRoles={["admin", "super_admin"]}>
      <div className="space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-emerald-800 to-teal-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 w-28 h-28 rounded-full bg-emerald-400/15" />
          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <p className="text-white/60 text-sm font-medium">Content Management</p>
              </div>
              <h1 className="font-display font-extrabold text-3xl text-white mb-2">Curriculum</h1>
              <p className="text-white/60 text-sm">All subjects, topics, and lessons on the platform.</p>
              {!loading && (
                <span className="inline-block mt-4 text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {subjects.length} Subjects
                </span>
              )}
            </div>
            <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer"
              className="flex-shrink-0 text-xs font-semibold bg-white/15 border border-white/25 hover:bg-white/25 text-white px-4 py-2 rounded-xl transition-colors">
              Edit in Admin →
            </a>
          </div>
        </div>

        {/* Subjects */}
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-brand-300" />
            </div>
            <p className="text-gray-400 font-medium">No curriculum content yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject, idx) => <SubjectSection key={subject.id} subject={subject} idx={idx} />)}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
