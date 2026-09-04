import { useState } from "react";
import DailyGoalCard from "../components/goals/DailyGoalCard";
import MonthlyGoalCard from "../components/goals/MonthlyGoalCard";
import ReadingCardStreak from "../components/goals/ReadingCardStreak";
import WeeklyGoalCard from "../components/goals/WeeklyGoalCard";
import GoalsHero from "../components/goals/GoalsHero";
import GoalsSummaryCard from "../components/goals/GoalsSummaryCard";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button";
import ManualReadingModal from "../components/goals/ManualReadingModal";

export default function Goals() {
  const [summaryKey, setSummaryKey] = useState(0);
  const [isManualReadingOpen, setIsManualReadingOpen] = useState(false);

  function refreshGoalsData() {
    setSummaryKey((prev) => prev + 1);
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-8 pb-8 sm:space-y-10">
        <GoalsHero />
        <div className="flex">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => setIsManualReadingOpen(true)}
          >
            Registrar leitura
          </Button>
        </div>

        <GoalsSummaryCard key={summaryKey} />

        <section aria-labelledby="goals-section-title">
          <h2
            id="goals-section-title"
            className="mb-5 font-display text-lg font-semibold text-text sm:mb-6 sm:text-xl"
          >
            Suas metas
          </h2>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DailyGoalCard onGoalChange={refreshGoalsData} />
              <WeeklyGoalCard onGoalChange={refreshGoalsData} />
            </div>

            <div className="gap-5 sm:gap-6 lg:col-span-12">
              <MonthlyGoalCard onGoalChange={refreshGoalsData} />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 py-1 sm:py-2">
          <div className="h-px flex-1 bg-text/10" />
        </div>

        <ReadingCardStreak />
      </div>
      <ManualReadingModal
        open={isManualReadingOpen}
        onClose={() => setIsManualReadingOpen(false)}
        onSaved={refreshGoalsData}
      />
    </DashboardLayout>
  );
}
