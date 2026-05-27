"use client";

import { useEffect } from "react";
import "intro.js/introjs.css";
import { useAuth } from "@/lib/auth";
import { useTour } from "@/hooks/useTour";

type TourStep = {
  element?: string;
  title: string;
  intro: string;
};

const studentSteps: TourStep[] = [
  {
    title: "Welcome to PE Platform! 🎓",
    intro: "You're in! Let's take a quick 30-second tour so you know where everything lives.",
  },
  {
    element: '[data-tour="nav-dashboard"]',
    title: "Dashboard",
    intro: "Your home base — see your XP, active streak, and recent quiz results at a glance.",
  },
  {
    element: '[data-tour="nav-curriculum"]',
    title: "Curriculum",
    intro: "Browse subjects, topics, and start lessons. Your full learning path lives here.",
  },
  {
    element: '[data-tour="nav-quizzes"]',
    title: "Quizzes",
    intro: "Test your knowledge and earn marks. All your quiz history is saved here.",
  },
  {
    element: '[data-tour="nav-certificates"]',
    title: "Certificates",
    intro: "Every certificate you earn is stored here. Download and share them!",
  },
  {
    element: '[data-tour="nav-achievements"]',
    title: "Achievements",
    intro: "Collect badges and XP for hitting learning milestones. Try to unlock them all!",
  },
  {
    element: '[data-tour="user-strip"]',
    title: "You're all set! 🚀",
    intro: "Your profile and role are pinned here. Enjoy the platform — go earn your first badge!",
  },
];

const teacherSteps: TourStep[] = [
  {
    title: "Welcome, Teacher! 👋",
    intro: "Let's take a quick tour of your workspace. It'll only take 30 seconds.",
  },
  {
    element: '[data-tour="nav-dashboard"]',
    title: "Dashboard",
    intro: "Your overview — enrolled students, class counts, average scores, and pass rates.",
  },
  {
    element: '[data-tour="nav-classes"]',
    title: "My Classes",
    intro: "Create and manage your classes. Add students and track their progress here.",
  },
  {
    element: '[data-tour="nav-curriculum"]',
    title: "Curriculum",
    intro: "Browse all subjects and lessons available to assign to your students.",
  },
  {
    element: '[data-tour="nav-assessments"]',
    title: "Assessments",
    intro: "Build quizzes and assign them to your classes. Results are tracked automatically.",
  },
  {
    element: '[data-tour="nav-analytics"]',
    title: "Analytics",
    intro: "Deep-dive into class performance — scores, completion rates, and student progress.",
  },
  {
    element: '[data-tour="user-strip"]',
    title: "Ready to teach! 🎉",
    intro: "Your profile is always here. Go create your first class and add some students!",
  },
];

const adminSteps: TourStep[] = [
  {
    title: "Welcome, Admin! 🛡️",
    intro: "You have full platform access. Let's take a quick look at what's available.",
  },
  {
    element: '[data-tour="nav-dashboard"]',
    title: "Dashboard",
    intro: "Platform-wide stats — schools, users, lessons completed, and system health at a glance.",
  },
  {
    element: '[data-tour="nav-schools"]',
    title: "Schools",
    intro: "Register and manage schools. Each school can have its own classes and teachers.",
  },
  {
    element: '[data-tour="nav-users"]',
    title: "Users",
    intro: "Manage all teachers, students, coaches, and admins across the entire platform.",
  },
  {
    element: '[data-tour="nav-curriculum"]',
    title: "Curriculum",
    intro: "Create and edit subjects, topics, and lessons that students and teachers use.",
  },
  {
    element: '[data-tour="nav-analytics"]',
    title: "Analytics",
    intro: "Platform-wide performance analytics — class comparisons, scores, and pass rates.",
  },
  {
    element: '[data-tour="user-strip"]',
    title: "Full access enabled! ✅",
    intro: "Your admin profile is always visible here. You're in control of the platform.",
  },
];

export function ProductTour() {
  const { user, isRole } = useAuth();
  const { shouldShow, markDone } = useTour();

  useEffect(() => {
    if (!shouldShow || !user) return;

    const media = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!media.matches || reducedMotion.matches) return;

    import("intro.js").then((mod) => {
      const introJs = (mod.default ?? mod) as (element?: HTMLElement) => ReturnType<typeof import("intro.js")["default"]>;
      const steps = isRole("admin", "super_admin")
        ? adminSteps
        : isRole("teacher", "coach")
        ? teacherSteps
        : studentSteps;

      const tour = introJs();
      tour.setOptions({
        steps,
        exitOnOverlayClick: false,
        showBullets: true,
        showProgress: true,
        nextLabel: "Next →",
        prevLabel: "← Back",
        doneLabel: "Let's go! 🚀",
        skipLabel: "Skip tour",
        tooltipClass: "pe-tour-tooltip",
        overlayOpacity: 0.55,
        scrollToElement: true,
        scrollPadding: 40,
        disableInteraction: true,
      });

      tour.oncomplete(markDone);
      tour.onexit(markDone);

      // Delay so the DOM is fully rendered
      setTimeout(() => tour.start(), 700);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow, user]);

  return null;
}
