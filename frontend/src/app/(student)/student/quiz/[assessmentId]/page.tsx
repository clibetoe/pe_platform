"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { assessmentApi } from "@/lib/api";
import type { Assessment, Attempt, AttemptResult, Question } from "@/types";
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Award } from "lucide-react";
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

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </DashboardLayout>
    );
  }

  if (phase === "intro") {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <p className="text-xs text-gray-400 mb-1">{assessment.lesson_title}</p>
              <CardTitle>{assessment.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.description && (
                <p className="text-gray-600">{assessment.description}</p>
              )}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-900">{assessment.question_count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Questions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-900">{assessment.pass_score}%</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pass Score</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-900">
                    {assessment.time_limit_minutes ?? "∞"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Minutes</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Max {assessment.max_attempts} attempt{assessment.max_attempts !== 1 ? "s" : ""} allowed
              </p>
              <Button onClick={startQuiz} className="w-full" size="lg">
                Begin Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (phase === "result" && result) {
    const correct = result.question_results.filter((r) => r.is_correct).length;
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardContent className="py-8 text-center">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                result.passed ? "bg-green-100" : "bg-red-100"
              )}>
                {result.passed
                  ? <Award size={40} className="text-green-600" />
                  : <XCircle size={40} className="text-red-600" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {result.passed ? "Congratulations!" : "Keep Practising!"}
              </h2>
              <p className="text-gray-500 mt-1">
                {result.passed ? "You passed the quiz." : "You didn't reach the pass score."}
              </p>
              <div className="flex justify-center gap-8 mt-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{Number(result.score).toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Your Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{correct}/{result.question_results.length}</p>
                  <p className="text-sm text-gray-500">Correct</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{assessment.pass_score}%</p>
                  <p className="text-sm text-gray-500">Pass Mark</p>
                </div>
              </div>
              <div className="flex gap-3 justify-center mt-6">
                <Button variant="secondary" onClick={() => router.push("/student/quizzes")}>
                  All Quizzes
                </Button>
                {!result.passed && (
                  <Button onClick={() => { setPhase("intro"); setAnswers({}); setCurrent(0); }}>
                    Try Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Answer Review</h3>
            {result.question_results.map((qr, i) => (
              <Card key={qr.question_id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      qr.is_correct ? "bg-green-100" : "bg-red-100"
                    )}>
                      {qr.is_correct
                        ? <CheckCircle size={14} className="text-green-600" />
                        : <XCircle size={14} className="text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {i + 1}. {qr.question_text}
                      </p>
                      <p className="text-xs mt-1">
                        <span className="text-gray-400">Your answer: </span>
                        <span className={qr.is_correct ? "text-green-700" : "text-red-700"}>
                          {qr.given_answer || "(no answer)"}
                        </span>
                      </p>
                      {!qr.is_correct && (
                        <p className="text-xs mt-0.5">
                          <span className="text-gray-400">Correct: </span>
                          <span className="text-green-700">{qr.correct_answer}</span>
                        </p>
                      )}
                      {qr.explanation && (
                        <p className="text-xs text-gray-500 mt-1 italic">{qr.explanation}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">{assessment.title}</p>
            <p className="text-xs text-gray-400">
              Question {current + 1} of {questions.length}
            </p>
          </div>
          {timeLeft !== null && (
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold",
              timeLeft < 60 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
            )}>
              <Clock size={14} />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <ProgressBar value={current + 1} max={questions.length} />

        {q && (
          <Card>
            <CardContent className="py-6">
              <p className="text-base font-semibold text-gray-900 mb-6">{q.question_text}</p>

              {q.question_type === "true_false" ? (
                <div className="grid grid-cols-2 gap-3">
                  {["True", "False"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [String(q.id)]: opt }))}
                      className={cn(
                        "rounded-xl border-2 p-4 text-sm font-semibold transition-all",
                        answers[String(q.id)] === opt
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-gray-200 hover:border-brand-300"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setAnswers((prev) => ({ ...prev, [String(q.id)]: opt }))}
                      className={cn(
                        "w-full text-left rounded-xl border-2 px-4 py-3 text-sm transition-all flex items-center gap-3",
                        answers[String(q.id)] === opt
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-gray-200 hover:border-brand-300"
                      )}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
                        answers[String(q.id)] === opt
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-gray-300 text-gray-400"
                      )}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft size={16} /> Previous
          </Button>

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
              disabled={Object.keys(answers).length < questions.length}
            >
              Submit Quiz
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          {Object.keys(answers).length} / {questions.length} answered
        </p>
      </div>
    </DashboardLayout>
  );
}
