import { useState } from "react";
import DailyGoalCard from "../components/goals/DailyGoalCard";
import MonthlyGoalCard from "../components/goals/MonthlyGoalCard";
import ReadingCardStreak from "../components/goals/ReadingCardStreak";
import WeeklyGoalCard from "../components/goals/WeeklyGoalCard";
import GoalsHero from "../components/goals/GoalsHero";
import GoalsSummaryCard from "../components/goals/GoalsSummaryCard";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Goals() {
  const [summaryKey, setSummaryKey] = useState(0);

  function handleGoalChange() {
    setSummaryKey((prev) => prev + 1);
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-8 pb-8 sm:space-y-10">
        <GoalsHero />

        <GoalsSummaryCard key={summaryKey} />

        <section aria-labelledby="goals-section-title">
          <h2
            id="goals-section-title"
            className="mb-5 font-display text-lg font-semibold text-white/80 sm:mb-6 sm:text-xl"
          >
            Suas metas
          </h2>

          <div className="grid gap-5 sm:gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <DailyGoalCard onGoalChange={handleGoalChange} />
            </div>

            <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-7">
              <WeeklyGoalCard onGoalChange={handleGoalChange} />
              <MonthlyGoalCard onGoalChange={handleGoalChange} />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 py-1 sm:py-2">
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <ReadingCardStreak />
      </div>
    </DashboardLayout>
  );
}
