"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { curriculumApi } from "@/lib/api";
import type { Lesson } from "@/types";
import { ArrowLeft, CheckCircle, Clock, PlayCircle, BookOpen, Dumbbell, Brain } from "lucide-react";

const activityIcons = {
  watch: PlayCircle,
  read: BookOpen,
  practice: Dumbbell,
  reflect: Brain,
};

const activityColors = {
  watch: "bg-blue-50 text-blue-700 border-blue-200",
  read: "bg-green-50 text-green-700 border-green-200",
  practice: "bg-orange-50 text-orange-700 border-orange-200",
  reflect: "bg-purple-50 text-purple-700 border-purple-200",
};

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
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <Link href="/student/curriculum" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="info">{lesson.subject_name}</Badge>
            <Badge>{lesson.topic_title}</Badge>
            {lesson.duration_minutes > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} /> {lesson.duration_minutes} min
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-gray-500 mt-2">{lesson.description}</p>
          )}
        </div>

        {lesson.video_url && (
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <iframe
              src={lesson.video_url}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {lesson.content && (
          <Card>
            <CardHeader><CardTitle>Lesson Content</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {lesson.content}
              </div>
            </CardContent>
          </Card>
        )}

        {lesson.activities && lesson.activities.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
            {lesson.activities.map((activity) => {
              const Icon = activityIcons[activity.activity_type] ?? BookOpen;
              const color = activityColors[activity.activity_type];
              return (
                <div key={activity.id} className={`border rounded-xl p-4 ${color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {activity.activity_type}
                    </span>
                  </div>
                  <h3 className="font-semibold">{activity.title}</h3>
                  {activity.description && (
                    <p className="text-sm mt-1 opacity-80">{activity.description}</p>
                  )}
                  {activity.content && (
                    <p className="text-sm mt-2 opacity-70 whitespace-pre-wrap">{activity.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {lesson.scenarios && lesson.scenarios.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Values Scenarios</h2>
            {lesson.scenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardContent className="pt-4">
                  <Badge variant="info" className="mb-2">{scenario.linked_value_name}</Badge>
                  <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{scenario.scenario_text}</p>
                  <p className="text-sm font-medium text-gray-800 mt-3">{scenario.question}</p>
                  <ul className="mt-2 space-y-1">
                    {scenario.options.map((opt, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          {completed ? (
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <CheckCircle size={20} />
              Lesson marked as complete!
            </div>
          ) : (
            <Button onClick={handleComplete} loading={marking} size="lg">
              <CheckCircle size={18} />
              Mark as Complete
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
