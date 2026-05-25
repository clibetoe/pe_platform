"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { curriculumApi } from "@/lib/api";
import type { Subject, Topic } from "@/types";
import { BookOpen, ChevronRight, Eye, EyeOff } from "lucide-react";

const colorMap = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
];

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Card>
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
          <ChevronRight size={14} />
          {topic.title}
        </div>
        <div className="space-y-1.5">
          {topic.lessons?.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between text-xs gap-2">
              <span className="text-gray-700 truncate">{lesson.title}</span>
              {lesson.is_published ? (
                <Eye size={12} className="text-green-500 flex-shrink-0" />
              ) : (
                <EyeOff size={12} className="text-gray-300 flex-shrink-0" />
              )}
            </div>
          ))}
          {(!topic.lessons || topic.lessons.length === 0) && (
            <p className="text-xs text-gray-400">No lessons</p>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">{topic.lesson_count} lesson{topic.lesson_count !== 1 ? "s" : ""}</p>
      </CardContent>
    </Card>
  );
}

function SubjectSection({ subject, idx }: { subject: Subject; idx: number }) {
  const [detail, setDetail] = useState<Subject | null>(null);

  useEffect(() => {
    curriculumApi.subject(subject.id).then((r) => setDetail(r.data));
  }, [subject.id]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[idx % colorMap.length]}`}>
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{subject.name}</h2>
          {subject.description && (
            <p className="text-sm text-gray-500">{subject.description}</p>
          )}
        </div>
        <span className="ml-auto text-sm text-gray-400">{subject.topic_count} topics</span>
      </div>

      {detail?.topics ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-12 mb-6">
          {detail.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="ml-12 mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(Math.min(subject.topic_count, 3))].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
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
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum</h1>
            <p className="text-gray-500 mt-1">All subjects, topics, and lessons.</p>
          </div>
          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-brand-600 hover:underline font-medium"
          >
            Edit in Admin Panel →
          </a>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">No curriculum content yet.</p>
          </div>
        ) : (
          subjects.map((subject, idx) => (
            <SubjectSection key={subject.id} subject={subject} idx={idx} />
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
