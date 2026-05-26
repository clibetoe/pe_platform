"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  BookOpen, Award, Users, BarChart2, ChevronRight,
  Target, Zap, Shield, Trophy, Star, Play, Menu, X,
} from "lucide-react";

const subjects = [
  { title: "Athletics", lessons: 24, icon: "🏃", gradient: "from-orange-500 to-rose-600" },
  { title: "Swimming", lessons: 18, icon: "🏊", gradient: "from-blue-500 to-cyan-600" },
  { title: "Team Sports", lessons: 32, icon: "⚽", gradient: "from-green-500 to-emerald-600" },
  { title: "Gymnastics", lessons: 20, icon: "🤸", gradient: "from-purple-500 to-fuchsia-600" },
  { title: "Sports Science", lessons: 15, icon: "🔬", gradient: "from-amber-500 to-orange-600" },
  { title: "Olympic Values", lessons: 28, icon: "🏅", gradient: "from-indigo-500 to-blue-600" },
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 animate-float" />
      <div
        className="absolute bottom-12 -left-16 w-72 h-72 rounded-full bg-accent-500/15 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-accent-400/30 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-2/3 right-1/3 w-6 h-6 rounded-full bg-white/20 animate-float"
        style={{ animationDelay: "3s" }}
      />
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute top-14 right-14 flex gap-3 opacity-15">
        <div className="w-14 h-14 rounded-full border-2 border-blue-300" />
        <div className="w-14 h-14 rounded-full border-2 border-yellow-300 -mt-2" />
        <div className="w-14 h-14 rounded-full border-2 border-green-300" />
        <div className="w-14 h-14 rounded-full border-2 border-red-300 -mt-2" />
      </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-accent-600">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-transparent border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-display font-bold text-sm shadow-sm">
              PE
            </div>
            <div className="hidden sm:block">
              <p className={`font-display font-bold text-sm leading-none transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
                PE Platform
              </p>
              <p className={`text-xs leading-none mt-0.5 transition-colors ${scrolled ? "text-gray-400" : "text-white/50"}`}>
                Olympic Values Education
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Subjects", "How It Works", "Features"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                className={`text-sm font-medium transition-colors hover:text-brand-400 ${
                  scrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`hidden sm:block text-sm font-semibold transition-colors ${
                scrolled ? "text-gray-700 hover:text-brand-600" : "text-white/90 hover:text-white"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
            {["Subjects", "How It Works", "Features"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-700 font-medium py-2.5 border-b border-gray-50 last:border-0"
              >
                {label}
              </a>
            ))}
            <Link
              href="/login"
              className="block text-sm text-gray-700 font-medium py-2.5"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 overflow-hidden pt-16">
        <HeroDecor />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-8">
              <Zap size={13} className="text-accent-300" />
              <span className="text-sm text-white/75 font-medium">Olympic Values Education Programme</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.08] mb-6 tracking-tight">
              Learn.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                Train.
              </span>
              {" "}Excel.
            </h1>

            <p className="text-lg sm:text-xl text-white/65 mb-10 max-w-2xl leading-relaxed">
              The complete Physical Education platform built for schools.
              Master Olympic values, earn verified certificates, and unlock your full potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base bg-white text-brand-700 hover:bg-brand-50 transition-all shadow-floating"
              >
                Get Started Free
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base glass-card text-white hover:bg-white/20 transition-all"
              >
                <Play size={15} className="fill-white" />
                Sign In
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
              {[
                { value: "5,000+", label: "Active Students" },
                { value: "98%", label: "Pass Rate" },
                { value: "Free", label: "To Get Started" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display font-bold text-white text-xl">{value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 72L1440 72L1440 36C1200 4 960 18 720 36C480 54 240 18 0 36L0 72Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "12+", label: "Subjects" },
              { value: "200+", label: "Lessons" },
              { value: "5,000+", label: "Students" },
              { value: "98%", label: "Pass Rate" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-extrabold text-4xl text-brand-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ──────────────────────────────────────────────── */}
      <section id="subjects" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-gray-900 mb-4">
              Explore Our Curriculum
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From athletics to sports science — comprehensive content built by PE experts
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((subject) => (
              <Link key={subject.title} href="/register" className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-card card-hover border border-gray-100">
                  <div className={`h-32 bg-gradient-to-br ${subject.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <span className="text-5xl filter drop-shadow-sm select-none">{subject.icon}</span>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-gray-900 text-lg">{subject.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-400">{subject.lessons} lessons</span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-brand-600 group-hover:gap-1.5 transition-all">
                        Explore <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              See all subjects <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-gray-900 mb-4">
              Your Learning Journey
            </h2>
            <p className="text-lg text-gray-500">Four simple steps from sign-up to certification</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-full w-full h-px bg-gradient-to-r from-brand-200 to-transparent z-0 -translate-x-3" />
                )}
                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-card h-full">
                  <span className="font-display font-extrabold text-5xl text-gray-100 leading-none block mb-2">
                    {step.num}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <step.icon size={20} className="text-brand-600" />
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold text-4xl text-gray-900 mb-4 leading-tight">
                Everything You Need{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">
                  to Succeed
                </span>
              </h2>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Built for schools — with dedicated tools for students, teachers, coaches, and administrators.
              </p>
              <div className="space-y-5">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-brand-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-none mb-1">{title}</h4>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-brand-900 to-accent-700 p-8 shadow-floating">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-5">Student Dashboard</p>
                <div className="space-y-3">
                  {[
                    { label: "Athletics", score: 85, color: "bg-orange-400" },
                    { label: "Swimming", score: 72, color: "bg-cyan-400" },
                    { label: "Team Sports", score: 91, color: "bg-green-400" },
                    { label: "Olympic Values", score: 78, color: "bg-purple-400" },
                  ].map(({ label, score, color }) => (
                    <div key={label} className="glass-card rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-white">{label}</span>
                        <span className="text-sm font-bold text-white">{score}%</span>
                      </div>
                      <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: "Lessons Done", value: "24/30" },
                    { label: "Day Streak", value: "7 🔥" },
                    { label: "Class Rank", value: "#3" },
                  ].map(({ label, value }) => (
                    <div key={label} className="glass-card rounded-xl p-3 text-center">
                      <p className="font-display font-bold text-white text-lg">{value}</p>
                      <p className="text-xs text-white/50 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-5 -right-5 bg-white shadow-card-hover rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Trophy size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Achievement Unlocked</p>
                  <p className="text-sm font-bold text-gray-900">Top Performer 🏆</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-white/4 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-8">
            <Star size={13} className="text-amber-400" />
            <span className="text-sm text-white/75">Join thousands of students across Africa</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-6 leading-tight">
            Ready to Start<br className="hidden sm:block" /> Your Journey?
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Create a free account today and begin mastering Physical Education with world-class content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-white text-brand-700 hover:bg-brand-50 transition-all shadow-floating"
            >
              Create Free Account
              <ChevronRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold glass-card text-white hover:bg-white/20 transition-all"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center font-display font-bold text-sm">
                PE
              </div>
              <div>
                <p className="font-display font-bold text-sm">PE Platform</p>
                <p className="text-xs text-gray-500">Olympic Values Education Programme</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">Sign In</Link>
              <Link href="/register" className="text-sm text-gray-500 hover:text-white transition-colors">Register</Link>
            </div>
            <p className="text-sm text-gray-600">© 2025 PE Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
