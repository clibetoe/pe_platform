"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { curriculumApi } from "@/lib/api";
import type { Subject } from "@/types";
import { BookOpen, ChevronRight, Clock, ChevronDown, Layers } from "lucide-react";

const subjectGradients = [
  { bar: "from-brand-500 to-brand-700", bg: "from-brand-50 to-indigo-50/60", icon: "from-brand-500 to-brand-700", ring: "ring-brand-200", text: "text-brand-700", count: "bg-brand-100 text-brand-700" },
  { bar: "from-emerald-500 to-teal-600", bg: "from-emerald-50 to-teal-50/60", icon: "from-emerald-500 to-teal-600", ring: "ring-emerald-200", text: "text-emerald-700", count: "bg-emerald-100 text-emerald-700" },
  { bar: "from-amber-400 to-orange-500", bg: "from-amber-50 to-orange-50/60", icon: "from-amber-400 to-orange-500", ring: "ring-amber-200", text: "text-amber-700", count: "bg-amber-100 text-amber-700" },
  { bar: "from-violet-500 to-purple-600", bg: "from-violet-50 to-purple-50/60", icon: "from-violet-500 to-purple-600", ring: "ring-violet-200", text: "text-violet-700", count: "bg-violet-100 text-violet-700" },
  { bar: "from-rose-500 to-pink-600", bg: "from-rose-50 to-pink-50/60", icon: "from-rose-500 to-pink-600", ring: "ring-rose-200", text: "text-rose-700", count: "bg-rose-100 text-rose-700" },
  { bar: "from-cyan-500 to-sky-600", bg: "from-cyan-50 to-sky-50/60", icon: "from-cyan-500 to-sky-600", ring: "ring-cyan-200", text: "text-cyan-700", count: "bg-cyan-100 text-cyan-700" },
];

export default function CurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    curriculumApi.subjects().then((r) => {
      setSubjects(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  const toggle = (id: number) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-accent-500/15" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <p className="text-white/60 text-sm font-medium">Learning Path</p>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">Curriculum</h1>
            <p className="text-white/60 text-sm max-w-lg">
              Explore subjects, topics, and lessons. Click a subject to browse its content.
            </p>
            {!loading && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {subjects.length} Subjects
                </span>
                <span className="text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {subjects.reduce((acc, s) => acc + (s.topic_count ?? 0), 0)} Topics
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Subject list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-brand-300" />
            </div>
            <p className="text-gray-400 font-medium">No curriculum content yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject, idx) => {
              const g = subjectGradients[idx % subjectGradients.length];
              const isOpen = !!expanded[subject.id];
              return (
                <div
                  key={subject.id}
                  className={`rounded-2xl border border-white ring-1 ${g.ring} overflow-hidden bg-gradient-to-br ${g.bg} shadow-card transition-all duration-200`}
                >
                  {/* Subject header */}
                  <button
                    onClick={() => toggle(subject.id)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${g.icon} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display font-bold text-gray-900 text-lg leading-tight">{subject.name}</h2>
                      {subject.description && (
                        <p className="text-sm text-gray-500 mt-0.5 truncate">{subject.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${g.count}`}>
                        {subject.topic_count} topics
                      </span>
                      <ChevronDown
                        size={18}
                        className={`${g.text} transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Expanded topics */}
                  {isOpen && (
                    <div className="border-t border-white/60 px-6 pb-6 pt-4">
                      <SubjectTopics subjectId={subject.id} gradient={g} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function SubjectTopics({ subjectId, gradient }: { subjectId: number; gradient: typeof subjectGradients[0] }) {
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    curriculumApi.subject(subjectId).then((r) => setSubject(r.data));
  }, [subjectId]);

  if (!subject) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28" />)}
      </div>
    );
  }

  if (!subject.topics?.length) {
    return <p className="text-sm text-gray-400 py-2">No topics in this subject yet.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subject.topics.map((topic) => (
        <div key={topic.id} className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          {/* Topic header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-50">
            <Layers size={14} className={gradient.text} />
            <h3 className="text-sm font-bold text-gray-800 truncate">{topic.title}</h3>
          </div>
          {/* Lessons */}
          <div className="divide-y divide-gray-50">
            {topic.lessons?.slice(0, 4).map((lesson) => (
              <Link
                key={lesson.id}
                href={`/student/curriculum/${lesson.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <ChevronRight size={14} className={`mt-0.5 flex-shrink-0 ${gradient.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-brand-700 transition-colors truncate">
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {lesson.duration_minutes > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={10} />
                        {lesson.duration_minutes}m
                      </span>
                    )}
                    {lesson.activity_count > 0 && (
                      <Badge variant="info">{lesson.activity_count} activities</Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {(topic.lessons?.length ?? 0) > 4 && (
              <p className="text-xs text-gray-400 px-4 py-2.5 text-center">
                +{(topic.lessons?.length ?? 0) - 4} more lessons
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
