"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { assessmentApi } from "@/lib/api";
import { Trophy } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Achievement {
  id: number;
  achievement_type: string;
  achievement_label: string;
  earned_at: string;
  xp_awarded: number;
}

const badgeColors: Record<string, string> = {
  fitness_champion: "from-orange-400 to-red-500",
  quiz_master: "from-blue-400 to-indigo-500",
  streak_7: "from-green-400 to-teal-500",
  ovep_explorer: "from-purple-400 to-pink-500",
  first_cert: "from-amber-400 to-yellow-500",
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    assessmentApi.achievements().then((r) => setAchievements(r.data.results ?? r.data));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-500 mt-1">Badges and XP earned on your learning journey.</p>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={56} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">No achievements yet. Keep learning to unlock badges!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((a) => {
              const gradient = badgeColors[a.achievement_type] ?? "from-gray-400 to-gray-500";
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-3`}>
                    <Trophy size={28} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">{a.achievement_label}</h3>
                  <p className="text-sm text-gray-400 mt-1">{formatDate(a.earned_at)}</p>
                  <div className="mt-3 inline-flex items-center gap-1 bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-semibold">
                    +{a.xp_awarded} XP
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
