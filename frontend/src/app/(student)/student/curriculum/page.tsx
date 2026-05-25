"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { curriculumApi } from "@/lib/api";
import type { Subject } from "@/types";
import { BookOpen, ChevronRight, Clock } from "lucide-react";

export default function CurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    curriculumApi.subjects().then((r) => {
      setSubjects(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  const iconColors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-orange-100 text-orange-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Curriculum</h1>
          <p className="text-gray-500 mt-1">Browse subjects, topics, and lessons.</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {subjects.map((subject, idx) => (
              <div key={subject.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColors[idx % iconColors.length]}`}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{subject.name}</h2>
                    <p className="text-sm text-gray-500">{subject.topic_count} topics</p>
                  </div>
                </div>

                <SubjectTopics subjectId={subject.id} />
              </div>
            ))}

            {subjects.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
                <p>No curriculum content yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function SubjectTopics({ subjectId }: { subjectId: number }) {
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    curriculumApi.subject(subjectId).then((r) => setSubject(r.data));
  }, [subjectId]);

  if (!subject?.topics) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-12">
      {subject.topics.map((topic) => (
        <div key={topic.id}>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <ChevronRight size={14} />
            {topic.title}
          </h3>
          <div className="space-y-2">
            {topic.lessons?.slice(0, 4).map((lesson) => (
              <Link
                key={lesson.id}
                href={`/student/curriculum/${lesson.id}`}
                className="block"
              >
                <Card className="hover:border-brand-300 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {lesson.duration_minutes > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} />
                          {lesson.duration_minutes}m
                        </span>
                      )}
                      <Badge variant="info">{lesson.activity_count} activities</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
