"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { curriculumApi } from "@/lib/api";
import type { Lesson } from "@/types";
import { ArrowLeft, CheckCircle, Clock, PlayCircle, BookOpen, Dumbbell, Brain, Lightbulb } from "lucide-react";

const activityConfig = {
  watch:    { icon: PlayCircle,  gradient: "from-blue-500 to-indigo-600",    bg: "bg-blue-50   border-blue-100",   label: "Watch" },
  read:     { icon: BookOpen,    gradient: "from-emerald-500 to-teal-600",   bg: "bg-emerald-50 border-emerald-100", label: "Read" },
  practice: { icon: Dumbbell,    gradient: "from-orange-400 to-red-500",     bg: "bg-orange-50 border-orange-100", label: "Practice" },
  reflect:  { icon: Brain,       gradient: "from-violet-500 to-purple-600",  bg: "bg-violet-50 border-violet-100", label: "Reflect" },
};
const defaultActivity = { icon: Lightbulb, gradient: "from-gray-400 to-slate-500", bg: "bg-gray-50 border-gray-100", label: "Activity" };

export default function LessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    curriculumApi.lesson(Number(lessonId)).then((r) => {
      setLesson(r.data);
      curriculumApi.markStarted(Number(lessonId));
    });
  }, [lessonId]);

  const handleComplete = async () => {
    setMarking(true);
    await curriculumApi.markComplete(Number(lessonId));
    setCompleted(true);
    setMarking(false);
  };

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl space-y-4">
          <div className="skeleton h-10 w-40" />
          <div className="skeleton h-48" />
          <div className="skeleton h-64" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-7">

        {/* Back link */}
        <Link
          href="/student/curriculum"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 font-medium transition-colors"
        >
          <ArrowLeft size={15} /> Back to Curriculum
        </Link>

        {/* Lesson hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-24 w-24 h-24 rounded-full bg-accent-400/15" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {lesson.subject_name && <Badge variant="info">{lesson.subject_name}</Badge>}
              {lesson.topic_title && <Badge>{lesson.topic_title}</Badge>}
              {lesson.duration_minutes > 0 && (
                <span className="flex items-center gap-1 text-xs text-white/50 bg-white/10 px-2.5 py-1 rounded-full">
                  <Clock size={11} /> {lesson.duration_minutes} min
                </span>
              )}
            </div>
            <h1 className="font-display font-extrabold text-2xl xl:text-3xl text-white leading-tight mb-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-white/65 text-sm max-w-xl leading-relaxed">{lesson.description}</p>
            )}
          </div>
        </div>

        {/* Video */}
        {lesson.video_url && (
          <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-card">
            <iframe
              src={lesson.video_url}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Content */}
        {lesson.content && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <BookOpen size={15} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-gray-900">Lesson Content</h2>
            </div>
            <div className="px-6 py-6 prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>
        )}

        {/* Activities */}
        {lesson.activities && lesson.activities.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-gray-900 text-lg">Activities</h2>
            <div className="space-y-3">
              {lesson.activities.map((activity) => {
                const cfg = activityConfig[activity.activity_type as keyof typeof activityConfig] ?? defaultActivity;
                const Icon = cfg.icon;
                return (
                  <div
                    key={activity.id}
                    className={`rounded-2xl border p-5 ${cfg.bg}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={15} className="text-white" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        {cfg.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{activity.title}</h3>
                    {activity.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
                    )}
                    {activity.content && (
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed whitespace-pre-wrap">{activity.content}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Values Scenarios */}
        {lesson.scenarios && lesson.scenarios.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-gray-900 text-lg">Values Scenarios</h2>
            <div className="space-y-4">
              {lesson.scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 px-5 py-3 flex items-center gap-2">
                    <Lightbulb size={14} className="text-violet-500" />
                    {scenario.linked_value_name && (
                      <Badge variant="info">{scenario.linked_value_name}</Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{scenario.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{scenario.scenario_text}</p>
                    <p className="text-sm font-semibold text-gray-800 mb-2">{scenario.question}</p>
                    <ul className="space-y-2">
                      {scenario.options.map((opt, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          {completed ? (
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-bold">Lesson Complete!</p>
                <p className="text-sm text-emerald-600">Great work — keep the momentum going.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900">Finished with this lesson?</p>
                <p className="text-sm text-gray-500 mt-0.5">Mark it complete to track your progress.</p>
              </div>
              <Button onClick={handleComplete} loading={marking} size="lg" className="flex-shrink-0">
                <CheckCircle size={17} />
                Mark as Complete
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
