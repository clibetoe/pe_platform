"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { assessmentApi } from "@/lib/api";
import { Trophy, Zap, Star, Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Achievement {
  id: number;
  achievement_type: string;
  achievement_label: string;
  earned_at: string;
  xp_awarded: number;
}

const badgeConfig: Record<string, { gradient: string; shadow: string; icon: typeof Trophy }> = {
  fitness_champion: { gradient: "from-orange-400 to-red-500", shadow: "shadow-orange-200", icon: Trophy },
  quiz_master:      { gradient: "from-brand-500 to-indigo-600", shadow: "shadow-brand-200", icon: Star },
  streak_7:         { gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200", icon: Zap },
  ovep_explorer:    { gradient: "from-violet-400 to-purple-600", shadow: "shadow-violet-200", icon: Trophy },
  first_cert:       { gradient: "from-amber-400 to-yellow-500", shadow: "shadow-amber-200", icon: Star },
};

const defaultBadge = { gradient: "from-gray-400 to-slate-500", shadow: "shadow-gray-200", icon: Trophy };

const allBadgeTypes = [
  { type: "first_cert",       label: "First Certificate",   desc: "Earn your very first certificate" },
  { type: "quiz_master",      label: "Quiz Master",          desc: "Pass 10 quizzes with distinction" },
  { type: "streak_7",         label: "7-Day Streak",         desc: "Learn 7 days in a row" },
  { type: "fitness_champion", label: "Fitness Champion",     desc: "Complete all fitness lessons" },
  { type: "ovep_explorer",    label: "OVEP Explorer",        desc: "Explore all subjects" },
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentApi.achievements().then((r) => {
      setAchievements(r.data.results ?? r.data);
      setLoading(false);
    });
  }, []);

  const earned = new Map(achievements.map((a) => [a.achievement_type, a]));
  const totalXP = achievements.reduce((sum, a) => sum + (a.xp_awarded ?? 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-purple-800 to-brand-900 p-8 text-white">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-violet-400/15" />
          <div className="absolute top-6 right-40 w-4 h-4 rounded-full bg-white/25" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Trophy size={20} className="text-white" />
                </div>
                <p className="text-white/60 text-sm font-medium">Hall of Fame</p>
              </div>
              <h1 className="font-display font-extrabold text-3xl text-white mb-2">Achievements</h1>
              <p className="text-white/60 text-sm max-w-lg">
                Earn badges and XP by completing learning milestones. Unlock them all!
              </p>
            </div>

            {/* XP total */}
            {!loading && (
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <span className="font-display font-extrabold text-3xl text-white leading-none">{totalXP}</span>
                <span className="text-white/55 text-xs mt-1.5 font-medium flex items-center gap-1"><Zap size={10} />Total XP</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Badges Earned", value: achievements.length, color: "text-violet-600", bg: "from-violet-50 to-purple-50", ring: "ring-violet-100" },
              { label: "XP Collected", value: totalXP, color: "text-amber-600", bg: "from-amber-50 to-orange-50", ring: "ring-amber-100" },
              { label: "Badges Left", value: allBadgeTypes.length - achievements.length, color: "text-gray-500", bg: "from-gray-50 to-slate-50", ring: "ring-gray-100" },
            ].map(({ label, value, color, bg, ring }) => (
              <div key={label} className={`rounded-2xl bg-gradient-to-br ${bg} border border-white ring-1 ${ring} p-5 text-center`}>
                <p className={`font-display font-extrabold text-3xl ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Badges grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-52" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allBadgeTypes.map(({ type, label, desc }) => {
              const cfg = badgeConfig[type] ?? defaultBadge;
              const Icon = cfg.icon;
              const a = earned.get(type);
              const isEarned = !!a;

              return (
                <div
                  key={type}
                  className={`relative rounded-2xl border overflow-hidden text-center transition-all duration-200 ${
                    isEarned
                      ? "bg-white border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
                      : "bg-gray-50/50 border-gray-100 opacity-60"
                  }`}
                >
                  {isEarned && (
                    <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient}`} />
                  )}

                  <div className="p-7">
                    {/* Badge circle */}
                    <div className="relative inline-flex mb-5">
                      <div className={`w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-lg ${cfg.shadow} ${
                        isEarned
                          ? `bg-gradient-to-br ${cfg.gradient}`
                          : "bg-gray-200"
                      }`}>
                        {isEarned
                          ? <Icon size={30} className="text-white" />
                          : <Lock size={24} className="text-gray-400" />
                        }
                      </div>
                      {isEarned && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                          <Star size={10} className="text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <h3 className={`font-display font-bold text-lg leading-tight mb-1 ${isEarned ? "text-gray-900" : "text-gray-400"}`}>
                      {label}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">{desc}</p>

                    {isEarned && a ? (
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-bold">
                          <Zap size={11} />
                          +{a.xp_awarded} XP
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(a.earned_at)}</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-400 rounded-full px-3 py-1 text-xs font-semibold">
                        <Lock size={10} /> Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
