"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  Award,
  BarChart2,
  BookOpen,
  ChevronRight,
  Menu,
  Play,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import Logo from "@/components/brand/Logo";

const subjects = [
  {
    title: "Athletics",
    lessons: 24,
    image: "https://images.unsplash.com/photo-1742428306000-2cc62636b54e?auto=format&fit=crop&w=1200&q=80",
    tone: "from-brand-950/95 via-brand-800/35 to-accent-500/25",
  },
  {
    title: "Swimming",
    lessons: 18,
    image: "https://images.unsplash.com/photo-1649556399012-259601ed7954?auto=format&fit=crop&w=1200&q=80",
    tone: "from-brand-950/95 via-sky-700/35 to-cyan-500/25",
  },
  {
    title: "Team Sports",
    lessons: 32,
    image: "https://images.unsplash.com/photo-1768492263368-46acc6804f14?auto=format&fit=crop&w=1200&q=80",
    tone: "from-brand-950/95 via-emerald-700/35 to-green-500/25",
  },
  {
    title: "Gymnastics",
    lessons: 20,
    image: "https://images.unsplash.com/photo-1567770320036-4d9a1f113c66?auto=format&fit=crop&w=1200&q=80",
    tone: "from-brand-950/95 via-blue-700/35 to-indigo-500/25",
  },
  {
    title: "Sports Science",
    lessons: 15,
    image: "https://images.unsplash.com/photo-1635863807845-add1be925a2f?auto=format&fit=crop&w=1200&q=80",
    tone: "from-brand-950/95 via-cyan-700/35 to-accent-500/25",
  },
  {
    title: "Olympic Values",
    lessons: 28,
    image: "https://images.unsplash.com/photo-1771402900086-ec8e18b0204e?auto=format&fit=crop&w=1200&q=80",
    tone: "from-brand-950/95 via-brand-700/35 to-emerald-500/25",
  },
];

const heroPhotos = [
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
];

const highlights = [
  { value: "5,000+", label: "Active students" },
  { value: "98%", label: "Pass rate" },
  { value: "12", label: "Learning tracks" },
];

const mobileStats = [
  { label: "Today", value: "04 lessons" },
  { label: "Streak", value: "07 days" },
  { label: "Rank", value: "Top 3" },
];

const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up as a student or teacher in under 60 seconds.", icon: Users },
  { num: "02", title: "Explore Subjects", desc: "Browse structured lessons across all PE disciplines.", icon: BookOpen },
  { num: "03", title: "Take Quizzes", desc: "Test your knowledge with adaptive assessments.", icon: Target },
  { num: "04", title: "Earn Certificates", desc: "Download and share your verified digital certificates.", icon: Award },
];

const features = [
  { icon: BookOpen, title: "200+ Structured Lessons", desc: "Expertly crafted content across all PE subjects" },
  { icon: Trophy, title: "Achievement System", desc: "Earn badges and track milestones as you progress" },
  { icon: Award, title: "Digital Certificates", desc: "Verified credentials you can download and share" },
  { icon: BarChart2, title: "Progress Analytics", desc: "Track scores, streaks, and subject mastery" },
  { icon: Users, title: "Class Management", desc: "Teachers manage classes, assign work, and monitor students" },
  { icon: Shield, title: "Safe & Secure", desc: "Role-based access for students, teachers, and admins" },
];

function HeroDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 animate-float" />
      <div className="absolute bottom-10 -left-20 h-80 w-80 rounded-full bg-accent-500/20 animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-1/4 h-10 w-10 rounded-full bg-brand-200/35 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-2/3 right-1/3 h-6 w-6 rounded-full bg-white/25 animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 right-1/3 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const dest =
        ["admin", "super_admin"].includes(user.role)
          ? "/admin/dashboard"
          : ["teacher", "coach"].includes(user.role)
            ? "/teacher/dashboard"
            : "/student/dashboard";
      router.replace(dest);
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (loading || user) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-accent-600">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/15 blur-xl animate-pulse" />
          <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 font-sans pb-24 md:pb-0">
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-xl" : "border-b border-white/10 bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo compact />

          <div className="hidden items-center gap-8 md:flex">
            {["Subjects", "How It Works", "Features"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                className={`text-sm font-medium transition-colors hover:text-brand-400 ${scrolled ? "text-slate-600" : "text-white/90"}`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`hidden text-sm font-semibold transition-colors sm:block ${scrolled ? "text-slate-700 hover:text-brand-600" : "text-white/90 hover:text-white"}`}
            >
              Sign In
            </Link>
            <Link href="/register" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700">
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className={`rounded-lg p-2 transition-colors md:hidden ${scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/70 bg-white/96 px-4 py-4 shadow-lg backdrop-blur-xl md:hidden sm:px-6">
            {["Subjects", "How It Works", "Features"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-slate-50 py-3 text-sm font-medium text-slate-700 last:border-0"
              >
                {label}
              </a>
            ))}
            <Link href="/login" className="block py-3 text-sm font-medium text-slate-700">
              Sign In
            </Link>
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-accent-700 pb-10 pt-16 sm:pb-14">
        <HeroDecor />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="pt-8 sm:pt-12 lg:py-16">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                <Zap size={13} className="text-accent-300" />
                <span className="text-sm font-medium text-white/80">Olympic Values Education Programme</span>
              </div>

              <h1 className="font-display mb-5 text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Learn. <span className="bg-gradient-to-r from-accent-300 to-brand-200 bg-clip-text text-transparent">Train.</span> Excel.
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg lg:text-xl">
                The complete Physical Education platform built for schools. Master Olympic values, earn verified certificates, and unlock your full potential.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-brand-800 transition-all hover:bg-brand-50 shadow-floating"
                >
                  Get Started Free
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/20"
                >
                  <Play size={15} className="fill-white" />
                  Sign In
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                {highlights.map(({ value, label }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-md">
                    <p className="text-xl font-bold leading-none text-white sm:text-2xl">{value}</p>
                    <p className="mt-1 text-xs text-white/60 sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:py-16">
              <div className="mx-auto max-w-[26rem] rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-floating backdrop-blur-xl sm:p-4">
                <div className="overflow-hidden rounded-[1.6rem] bg-white/95 p-3 text-slate-900 shadow-2xl sm:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">Today&apos;s focus</p>
                      <p className="text-sm font-semibold text-slate-900">Student home</p>
                    </div>
                    <div className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">87%</div>
                  </div>

                  <div className="relative mb-3 min-h-[18rem] overflow-hidden rounded-[1.5rem] sm:min-h-[22rem]">
                    <Image
                      src={heroPhotos[0]}
                      alt="Students training together"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-900/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <div className="max-w-[12rem] rounded-2xl bg-white/90 p-3 text-slate-900 shadow-lg backdrop-blur-md">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">Next lesson</p>
                        <p className="mt-1 text-sm font-semibold">Warmups and active movement</p>
                      </div>
                      <div className="rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-md">
                        24 min
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {mobileStats.map(({ label, value }) => (
                      <div key={label} className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-sm font-bold text-slate-900">{value}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-[1.3fr_0.7fr] gap-3">
                    <div className="relative min-h-28 overflow-hidden rounded-2xl">
                      <Image
                        src={heroPhotos[1]}
                        alt="Outdoor training session"
                        fill
                        sizes="(max-width: 1024px) 100vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 p-4 text-white">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Momentum</p>
                      <div>
                        <p className="text-2xl font-extrabold leading-none">7</p>
                        <p className="mt-1 text-xs text-white/70">day streak</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-3 top-8 hidden rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-md lg:block">
                Mobile-first flow
              </div>
              <div className="absolute -right-2 bottom-10 hidden rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-md lg:block">
                Works best on phone
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full">
            <path d="M0 72L1440 72L1440 36C1200 4 960 18 720 36C480 54 240 18 0 36L0 72Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { value: "12+", label: "Subjects" },
              { value: "200+", label: "Lessons" },
              { value: "5,000+", label: "Students" },
              { value: "98%", label: "Pass Rate" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-4xl font-extrabold text-brand-600">{value}</p>
                <p className="mt-1.5 text-sm font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="subjects" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="font-display mb-4 text-4xl font-bold text-slate-900">Explore Our Curriculum</h2>
            <p className="mx-auto max-w-xl text-lg text-slate-500">
              From athletics to sports science, the curriculum is designed for daily use on a phone first.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link key={subject.title} href="/register" className="group block">
                <div className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-card card-hover">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={subject.image}
                      alt={subject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${subject.tone}`} />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {subject.lessons} lessons
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Active track</p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-white">{subject.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-5">
                    <span className="text-sm text-slate-500">Tap to open the track</span>
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-brand-600 transition-all group-hover:gap-1.5">
                      Explore <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700">
              See all subjects <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-display mb-4 text-4xl font-bold text-slate-900">Your Learning Journey</h2>
            <p className="text-lg text-slate-500">Four simple steps from sign-up to certification</p>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.num} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-9 z-0 hidden h-px w-full -translate-x-3 bg-gradient-to-r from-brand-200 to-transparent lg:block" />
                )}
                <div className="relative h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
                  <span className="font-display mb-2 block text-5xl font-extrabold leading-none text-slate-100">{step.num}</span>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                    <step.icon size={20} className="text-brand-600" />
                  </div>
                  <h3 className="font-display mb-2 text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display mb-4 text-4xl font-bold leading-tight text-slate-900">
                Everything You Need <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">to Succeed</span>
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-slate-500">
                Built for schools with dedicated tools for students, teachers, coaches, and administrators.
              </p>
              <div className="space-y-5">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
                      <Icon size={18} className="text-brand-600" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-semibold leading-none text-slate-900">{title}</h4>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/80 bg-white p-4 shadow-floating">
                <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr] items-stretch">
                  <div className="relative min-h-[20rem] overflow-hidden rounded-[1.5rem]">
                    <Image
                      src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=1200&q=80"
                      alt="Students in an active learning session"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/75 via-brand-900/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">Live class</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">Practical warm-up with real-time feedback</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Athletics", score: 85, color: "bg-brand-500" },
                      { label: "Swimming", score: 72, color: "bg-accent-500" },
                      { label: "Team Sports", score: 91, color: "bg-emerald-500" },
                      { label: "Olympic Values", score: 78, color: "bg-sky-500" },
                    ].map(({ label, score, color }) => (
                      <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">{label}</span>
                          <span className="text-sm font-bold text-slate-700">{score}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {[
                        { label: "Lessons Done", value: "24/30" },
                        { label: "Day Streak", value: "7 days" },
                        { label: "Class Rank", value: "#3" },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-3 text-center">
                          <p className="font-display text-lg font-bold text-brand-700">{value}</p>
                          <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute -right-5 -top-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-card-hover">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500">
                    <Trophy size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Achievement Unlocked</p>
                    <p className="text-sm font-bold text-slate-900">Top Performer</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-3 top-8 hidden rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-md lg:block">
                Mobile-first flow
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <Star size={13} className="text-amber-400" />
            <span className="text-sm text-white/75">Join thousands of students across Africa</span>
          </div>
          <h2 className="mb-6 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Ready to Start<br className="hidden sm:block" /> Your Journey?
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-white/65">
            Create a free account today and begin mastering Physical Education with world-class content.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-brand-700 transition-all hover:bg-brand-50 shadow-floating"
            >
              Create Free Account
              <ChevronRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white transition-all hover:bg-white/20"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 py-12 pb-24 text-white md:pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Logo compact />
              <div>
                <p className="font-display text-sm font-bold">PE Platform</p>
                <p className="text-xs text-gray-500">Olympic Values Education Programme</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/login" className="text-sm text-gray-500 transition-colors hover:text-white">Sign In</Link>
              <Link href="/register" className="text-sm text-gray-500 transition-colors hover:text-white">Register</Link>
            </div>
            <p className="text-sm text-gray-600">© 2025 PE Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2 rounded-[1.35rem] border border-white/70 bg-white/90 p-2 shadow-floating backdrop-blur-xl">
          <Link href="/register" className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
            Get Started
            <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}