"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { assessmentApi } from "@/lib/api";
import type { Assessment, Attempt, AttemptResult, Question } from "@/types";
import {
  CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight,
  Award, Zap, ClipboardList, Target, RotateCcw, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "intro" | "quiz" | "result";

export default function QuizPage() {
  const { assessmentId } = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    assessmentApi.detail(Number(assessmentId)).then((r) => setAssessment(r.data));
  }, [assessmentId]);

  useEffect(() => {
    if (phase === "quiz" && assessment?.time_limit_minutes) {
      setTimeLeft(assessment.time_limit_minutes * 60);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t === null || t <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startQuiz = async () => {
    const r = await assessmentApi.start(Number(assessmentId));
    setAttempt(r.data);
    setPhase("quiz");
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const r = await assessmentApi.submit(Number(assessmentId), answers);
      setResult(r.data);
      setPhase("result");
    } finally {
      setSubmitting(false);
    }
  };

  const questions = assessment?.questions ?? [];
  const q: Question | undefined = questions[current];

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ─── Loading ─── */
  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto space-y-4">
          <div className="skeleton h-64" />
        </div>
      </DashboardLayout>
    );
  }

  /* ─── Intro ─── */
  if (phase === "intro") {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto space-y-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/student/quizzes")}
          >
            <ArrowLeft size={15} /> All Quizzes
          </Button>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
            {/* Gradient header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-violet-800 p-8 text-white">
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
              <div className="absolute bottom-0 left-1/3 w-20 h-20 rounded-full bg-violet-400/20" />
              <div className="relative z-10">
                {assessment.lesson_title && (
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-2">
                    {assessment.lesson_title}
                  </p>
                )}
                <h1 className="font-display font-extrabold text-2xl text-white leading-tight">
                  {assessment.title}
                </h1>
                {assessment.description && (
                  <p className="text-white/65 text-sm mt-2">{assessment.description}</p>
                )}
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Questions", value: assessment.question_count, icon: ClipboardList, color: "text-brand-600 bg-brand-50" },
                  { label: "Pass Score", value: `${assessment.pass_score}%`, icon: Target, color: "text-emerald-600 bg-emerald-50" },
                  { label: "Time Limit", value: assessment.time_limit_minutes ? `${assessment.time_limit_minutes}m` : "∞", icon: Clock, color: "text-amber-600 bg-amber-50" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                    <div className={`inline-flex w-8 h-8 rounded-lg ${color} items-center justify-center mb-2`}>
                      <Icon size={15} />
                    </div>
                    <p className="font-display font-extrabold text-xl text-gray-900 leading-none">{value}</p>
                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center">
                Max {assessment.max_attempts} attempt{assessment.max_attempts !== 1 ? "s" : ""} allowed
              </p>

              <Button onClick={startQuiz} className="w-full" size="lg">
                <Zap size={17} /> Begin Quiz
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ─── Result ─── */
  if (phase === "result" && result) {
    const correct = result.question_results.filter((r) => r.is_correct).length;
    const pct = Number(result.score);

    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Result hero card */}
          <div className={cn(
            "rounded-3xl overflow-hidden",
            result.passed
              ? "bg-gradient-to-br from-emerald-900 via-teal-800 to-brand-900"
              : "bg-gradient-to-br from-red-900 via-rose-800 to-brand-900"
          )}>
            <div className="relative p-10 text-white text-center">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg",
                  result.passed ? "bg-emerald-500/30 border border-emerald-400/40" : "bg-red-500/30 border border-red-400/40"
                )}>
                  {result.passed
                    ? <Award size={38} className="text-white" />
                    : <XCircle size={38} className="text-white" />
                  }
                </div>

                <h2 className="font-display font-extrabold text-3xl text-white mb-1">
                  {result.passed ? "Congratulations!" : "Keep Practising!"}
                </h2>
                <p className="text-white/60 text-sm mb-8">
                  {result.passed
                    ? "You passed — a certificate has been issued!"
                    : `You needed ${assessment.pass_score}% to pass. You can do it next time.`}
                </p>

                <div className="flex justify-center gap-8">
                  {[
                    { label: "Your Score", value: `${pct.toFixed(1)}%` },
                    { label: "Correct",    value: `${correct}/${result.question_results.length}` },
                    { label: "Pass Mark",  value: `${assessment.pass_score}%` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-display font-extrabold text-4xl text-white">{value}</p>
                      <p className="text-white/50 text-xs mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push("/student/quizzes")}>
              <ArrowLeft size={15} /> All Quizzes
            </Button>
            {!result.passed && (
              <Button onClick={() => { setPhase("intro"); setAnswers({}); setCurrent(0); setResult(null); }}>
                <RotateCcw size={15} /> Try Again
              </Button>
            )}
          </div>

          {/* Answer review */}
          <div>
            <h3 className="font-display font-bold text-gray-900 text-lg mb-4">Answer Review</h3>
            <div className="space-y-3">
              {result.question_results.map((qr, i) => (
                <div
                  key={qr.question_id}
                  className={cn(
                    "rounded-2xl border p-4",
                    qr.is_correct ? "bg-emerald-50/60 border-emerald-100" : "bg-red-50/60 border-red-100"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      qr.is_correct ? "bg-emerald-100" : "bg-red-100"
                    )}>
                      {qr.is_correct
                        ? <CheckCircle size={15} className="text-emerald-600" />
                        : <XCircle size={15} className="text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 mb-1.5">
                        {i + 1}. {qr.question_text}
                      </p>
                      <p className="text-xs">
                        <span className="text-gray-400">Your answer: </span>
                        <span className={cn("font-semibold", qr.is_correct ? "text-emerald-700" : "text-red-700")}>
                          {qr.given_answer || "(no answer)"}
                        </span>
                      </p>
                      {!qr.is_correct && (
                        <p className="text-xs mt-0.5">
                          <span className="text-gray-400">Correct answer: </span>
                          <span className="text-emerald-700 font-semibold">{qr.correct_answer}</span>
                        </p>
                      )}
                      {qr.explanation && (
                        <p className="text-xs text-gray-500 mt-1.5 italic border-t border-gray-100 pt-1.5">{qr.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ─── Quiz in progress ─── */
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((current + 1) / questions.length) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Quiz header bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-900">{assessment.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Question <span className="font-semibold text-brand-600">{current + 1}</span> of {questions.length}
              </p>
            </div>
            {timeLeft !== null && (
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold",
                timeLeft < 60 ? "bg-red-100 text-red-700" : "bg-brand-50 text-brand-700"
              )}>
                <Clock size={14} />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        {q && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-7">
            <p className="text-base font-bold text-gray-900 mb-6 leading-relaxed">{q.question_text}</p>

            {q.question_type === "true_false" ? (
              <div className="grid grid-cols-2 gap-3">
                {["True", "False"].map((opt) => {
                  const selected = answers[String(q.id)] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [String(q.id)]: opt }))}
                      className={cn(
                        "rounded-xl border-2 p-5 text-sm font-bold transition-all duration-150",
                        selected
                          ? "border-brand-600 bg-gradient-to-br from-brand-50 to-indigo-50 text-brand-700 shadow-glow"
                          : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const selected = answers[String(q.id)] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers((prev) => ({ ...prev, [String(q.id)]: opt }))}
                      className={cn(
                        "w-full text-left rounded-xl border-2 px-5 py-4 text-sm transition-all duration-150 flex items-center gap-4",
                        selected
                          ? "border-brand-600 bg-gradient-to-r from-brand-50 to-indigo-50 text-brand-900 shadow-glow"
                          : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <span className={cn(
                        "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all",
                        selected
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-gray-300 text-gray-400"
                      )}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {selected && <CheckCircle size={16} className="text-brand-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <span className="text-xs text-gray-400 font-medium">
            {answeredCount}/{questions.length} answered
          </span>

          {current < questions.length - 1 ? (
            <Button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!answers[String(q?.id)]}
            >
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={answeredCount < questions.length}
            >
              Submit Quiz <Zap size={15} />
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {questions.map((qItem, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-7 h-7 rounded-lg text-xs font-bold transition-all",
                i === current
                  ? "bg-brand-600 text-white"
                  : answers[String(qItem.id)]
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
