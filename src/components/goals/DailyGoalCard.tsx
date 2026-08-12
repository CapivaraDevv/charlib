import GoalCard from "./GoalCard";
import {
  getDailyReadingGoal,
  setDailyReadingGoal,
} from "../../services/readingService";

type DailyGoalCardProps = {
  onGoalChange?: () => void;
};

export default function DailyGoalCard({ onGoalChange }: DailyGoalCardProps) {
  return (
    <GoalCard
      period="daily"
      periodLabel="Diária"
      title="Meta diária"
      description="Quanto você pretende ler hoje, páginas ou minutos."
      defaultTarget={10}
      unitLabels={{
        pages: "páginas por dia",
        minutes: "minutos por dia",
      }}
      getGoal={getDailyReadingGoal}
      setGoal={setDailyReadingGoal}
      animationDelay={0.15}
      onGoalChange={onGoalChange}
    />
  );
}
