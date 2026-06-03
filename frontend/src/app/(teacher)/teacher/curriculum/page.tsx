"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { curriculumApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Subject, Topic } from "@/types";
import { ArrowRight, BookOpen, FileText, Layers, Plus, Upload, Video } from "lucide-react";

type TopicFormValues = {
  subject: number;
  title: string;
  description: string;
  order: number;
};

type LessonFormValues = {
  topic: number;
  title: string;
  description: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  order: number;
  is_published: boolean;
  pdf: FileList;
  thumbnail: FileList;
};

const subjectGradients = [
  { icon: "from-brand-500 to-brand-700", bg: "from-brand-50/70 to-indigo-50/50", count: "bg-brand-100 text-brand-700" },
  { icon: "from-emerald-500 to-teal-600", bg: "from-emerald-50/70 to-teal-50/50", count: "bg-emerald-100 text-emerald-700" },
  { icon: "from-amber-400 to-orange-500", bg: "from-amber-50/70 to-orange-50/50", count: "bg-amber-100 text-amber-700" },
  { icon: "from-violet-500 to-purple-600", bg: "from-violet-50/70 to-purple-50/50", count: "bg-violet-100 text-violet-700" },
  { icon: "from-rose-500 to-pink-600", bg: "from-rose-50/70 to-pink-50/50", count: "bg-rose-100 text-rose-700" },
  { icon: "from-cyan-500 to-sky-600", bg: "from-cyan-50/70 to-sky-50/50", count: "bg-cyan-100 text-cyan-700" },
];

export default function TeacherCurriculumPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [topicMessage, setTopicMessage] = useState<string | null>(null);
  const [lessonMessage, setLessonMessage] = useState<string | null>(null);

  const topicForm = useForm<TopicFormValues>({
    defaultValues: { subject: 0, title: "", description: "", order: 0 },
  });

  const lessonForm = useForm<LessonFormValues>({
    defaultValues: {
      topic: 0,
      title: "",
      description: "",
      content: "",
      video_url: "",
      duration_minutes: 0,
      order: 0,
      is_published: false,
    },
  });

  const activeTopics = useMemo(() => selectedSubject?.topics ?? [], [selectedSubject]);

  useEffect(() => {
    let active = true;

    async function loadSubjects() {
      try {
        const response = await curriculumApi.subjects();
        const nextSubjects = response.data.results ?? response.data;
        if (!active) return;
        setSubjects(nextSubjects);
        if (nextSubjects.length > 0) {
          setSelectedSubjectId((current) => current ?? nextSubjects[0].id);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSubjects();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSubjectId) return;
    const subjectId = selectedSubjectId;

    let active = true;

    async function loadSubjectDetail() {
      setSubjectLoading(true);
      try {
        const response = await curriculumApi.subject(subjectId);
        if (active) {
          setSelectedSubject(response.data);
          topicForm.setValue("subject", subjectId);
          if (response.data.topics?.length) {
            lessonForm.setValue("topic", response.data.topics[0].id);
          }
        }
      } finally {
        if (active) setSubjectLoading(false);
      }
    }

    void loadSubjectDetail();

    return () => {
      active = false;
    };
  }, [lessonForm, selectedSubjectId, topicForm]);

  useEffect(() => {
    if (selectedSubjectId) {
      topicForm.setValue("subject", selectedSubjectId);
    }
  }, [selectedSubjectId, topicForm]);

  useEffect(() => {
    if (activeTopics.length > 0 && lessonForm.getValues("topic") === 0) {
      lessonForm.setValue("topic", activeTopics[0].id);
    }
  }, [activeTopics, lessonForm]);

  const refreshCurrentSubject = async () => {
    if (!selectedSubjectId) return;
    const response = await curriculumApi.subject(selectedSubjectId);
    setSelectedSubject(response.data);
    if (response.data.topics?.length && lessonForm.getValues("topic") === 0) {
      lessonForm.setValue("topic", response.data.topics[0].id);
    }
  };

  const onCreateTopic = async (data: TopicFormValues) => {
    setTopicMessage(null);
    setCreatingTopic(true);
    try {
      const response = await curriculumApi.createTopic({
        subject: Number(data.subject),
        title: data.title.trim(),
        description: data.description.trim(),
        order: Number(data.order ?? 0),
      });
      setTopicMessage(`Created course module “${response.data.title}”.`);
      topicForm.reset({ subject: selectedSubjectId ?? data.subject, title: "", description: "", order: 0 });
      await refreshCurrentSubject();
      const subjectsResponse = await curriculumApi.subjects();
      setSubjects(subjectsResponse.data.results ?? subjectsResponse.data);
    } catch (error: unknown) {
      const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setTopicMessage(detail ?? "Failed to create the course module.");
    } finally {
      setCreatingTopic(false);
    }
  };

  const onCreateLesson = async (data: LessonFormValues) => {
    setLessonMessage(null);
    setCreatingLesson(true);
    try {
      const response = await curriculumApi.createLesson({
        topic: Number(data.topic),
        title: data.title.trim(),
        description: data.description.trim(),
        content: data.content.trim(),
        video_url: data.video_url.trim(),
        duration_minutes: Number(data.duration_minutes ?? 0),
        order: Number(data.order ?? 0),
        is_published: data.is_published,
        pdf: data.pdf?.[0],
        thumbnail: data.thumbnail?.[0],
      });

      setLessonMessage(`Created lesson “${response.data.title}” with uploads ready.`);
      lessonForm.reset({
        topic: data.topic,
        title: "",
        description: "",
        content: "",
        video_url: "",
        duration_minutes: 0,
        order: 0,
        is_published: false,
      });
      await refreshCurrentSubject();
      const subjectsResponse = await curriculumApi.subjects();
      setSubjects(subjectsResponse.data.results ?? subjectsResponse.data);
    } catch (error: unknown) {
      const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setLessonMessage(detail ?? "Failed to create the lesson.");
    } finally {
      setCreatingLesson(false);
    }
  };

  const activeSubjectStats = selectedSubject
    ? {
        topics: selectedSubject.topics?.length ?? 0,
        lessons: selectedSubject.topics?.reduce((count, topic) => count + (topic.lessons?.length ?? 0), 0) ?? 0,
      }
    : { topics: 0, lessons: 0 };

  return (
    <DashboardLayout requiredRoles={["teacher", "coach", "admin", "super_admin"]}>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 p-8 text-white">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-emerald-400/15" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Teacher and Coach Studio</p>
                  <p className="text-xs text-white/45">Create course modules, lessons, and uploads without leaving the app.</p>
                </div>
              </div>
              <h1 className="font-display mb-2 text-3xl font-extrabold text-white">Curriculum Builder</h1>
              <p className="max-w-2xl text-sm text-white/65">
                Teachers and coaches can build course modules inside any subject, then attach video links, PDFs, and thumbnails for the lessons they create.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{subjects.length}</p>
                <p className="text-xs text-white/60">Subjects</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{activeSubjectStats.topics}</p>
                <p className="text-xs text-white/60">Modules</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{activeSubjectStats.lessons}</p>
                <p className="text-xs text-white/60">Lessons</p>
              </div>
            </div>
          </div>
        </div>

        {user?.role === "coach" && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-900">
            Coach accounts have the same curriculum create permissions as teachers for modules and lesson uploads.
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Choose a subject</h2>
                  <p className="text-sm text-slate-500">Work inside an existing subject before you build modules and lessons.</p>
                </div>
                {loading ? null : <Badge variant="info">{subjects.length} total</Badge>}
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, index) => <div key={index} className="skeleton h-28" />)}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {subjects.map((subject, index) => {
                    const tone = subjectGradients[index % subjectGradients.length];
                    const active = subject.id === selectedSubjectId;
                    return (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => setSelectedSubjectId(subject.id)}
                        className={`text-left rounded-2xl border p-4 transition-all ${active ? "border-brand-200 bg-brand-50 shadow-card-hover" : "border-slate-100 bg-slate-50 hover:bg-white hover:shadow-card"}`}
                      >
                        <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tone.icon}`}>
                          <BookOpen size={18} className="text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">{subject.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{subject.description || "No description yet."}</p>
                        <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone.count}`}>
                          <Layers size={10} />
                          {subject.topic_count} modules
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Current subject</h2>
                  <p className="text-sm text-slate-500">Review existing modules and lessons before adding more.</p>
                </div>
                {subjectLoading ? <Badge variant="warning">Loading</Badge> : null}
              </div>

              {!selectedSubject ? (
                <p className="text-sm text-slate-500">Select a subject to continue.</p>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="font-display text-lg font-bold text-slate-900">{selectedSubject.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{selectedSubject.description || "No description available."}</p>
                  </div>

                  <div className="space-y-3">
                    {activeTopics.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        No modules yet. Create the first one using the form on this page.
                      </div>
                    ) : (
                      activeTopics.map((topic: Topic) => (
                        <div key={topic.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{topic.title}</p>
                              <p className="text-xs text-slate-500">{topic.description || "No module description."}</p>
                            </div>
                            <Badge variant="info">{topic.lesson_count} lessons</Badge>
                          </div>

                          {topic.lessons?.length ? (
                            <div className="mt-3 space-y-2">
                              {topic.lessons.map((lesson) => (
                                <div key={lesson.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-medium text-slate-900">{lesson.title}</span>
                                    <span className="text-xs text-slate-500">{lesson.is_published ? "Published" : "Draft"}</span>
                                  </div>
                                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                                    {lesson.video_url ? <span className="inline-flex items-center gap-1"><Video size={11} /> Video</span> : null}
                                    {lesson.pdf ? <span className="inline-flex items-center gap-1"><FileText size={11} /> PDF</span> : null}
                                    {lesson.thumbnail ? <span className="inline-flex items-center gap-1"><Upload size={11} /> Thumbnail</span> : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Plus size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Create a course module</h2>
                  <p className="text-sm text-slate-500">Teachers and coaches can add modules inside the selected subject.</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={topicForm.handleSubmit(onCreateTopic)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                    <select
                      {...topicForm.register("subject", { valueAsNumber: true, required: true })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    {...topicForm.register("order", { valueAsNumber: true })}
                    type="number"
                    label="Order"
                    min={0}
                    placeholder="0"
                  />
                </div>

                <Input
                  {...topicForm.register("title", { required: "Module title is required" })}
                  label="Module title"
                  placeholder="e.g. Weekly Fitness Foundations"
                  error={topicForm.formState.errors.title?.message}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    {...topicForm.register("description")}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Describe what this module covers."
                  />
                </div>

                {topicMessage ? <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">{topicMessage}</p> : null}

                <Button type="submit" loading={creatingTopic} className="w-full sm:w-auto">
                  Save module
                  <ArrowRight size={16} />
                </Button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
                  <Video size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Add lesson media</h2>
                  <p className="text-sm text-slate-500">Upload a PDF or thumbnail and attach a video URL to the lesson you create.</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={lessonForm.handleSubmit(onCreateLesson)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Module</label>
                    <select
                      {...lessonForm.register("topic", { valueAsNumber: true, required: true })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {activeTopics.length === 0 ? (
                        <option value={0}>Create a module first</option>
                      ) : (
                        activeTopics.map((topic) => (
                          <option key={topic.id} value={topic.id}>{topic.title}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <Input
                    {...lessonForm.register("duration_minutes", { valueAsNumber: true })}
                    type="number"
                    label="Duration (minutes)"
                    min={0}
                    placeholder="30"
                  />
                </div>

                <Input
                  {...lessonForm.register("title", { required: "Lesson title is required" })}
                  label="Lesson title"
                  placeholder="e.g. Warm-up and pacing techniques"
                  error={lessonForm.formState.errors.title?.message}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Lesson description</label>
                  <textarea
                    {...lessonForm.register("description")}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Short summary for students."
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Lesson content</label>
                  <textarea
                    {...lessonForm.register("content")}
                    rows={5}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Write the core lesson notes or instructions."
                  />
                </div>

                <Input
                  {...lessonForm.register("video_url")}
                  label="Video URL"
                  placeholder="https://youtube.com/... or an embed URL"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">PDF file</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      {...lessonForm.register("pdf")}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...lessonForm.register("thumbnail")}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    {...lessonForm.register("order", { valueAsNumber: true })}
                    type="number"
                    label="Order"
                    min={0}
                    placeholder="0"
                  />
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                    <input type="checkbox" {...lessonForm.register("is_published")} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    Publish immediately
                  </label>
                </div>

                {lessonMessage ? <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">{lessonMessage}</p> : null}

                <Button type="submit" loading={creatingLesson} className="w-full sm:w-auto">
                  Save lesson
                  <ArrowRight size={16} />
                </Button>
              </form>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-400">
          Top-level subjects remain admin-managed. Teachers and coaches work inside a subject, where they can create course modules and lesson uploads.
        </p>
      </div>
    </DashboardLayout>
  );
}