import GoalCard from "./GoalCard";
import {
  getWeeklyReadingGoal,
  setWeeklyReadingGoal,
} from "../../services/readingService";

type WeeklyGoalCardProps = {
  onGoalChange?: () => void;
};

export default function WeeklyGoalCard({ onGoalChange }: WeeklyGoalCardProps) {
  return (
    <GoalCard
      period="weekly"
      periodLabel="Semanal"
      title="Meta semanal"
      description="Um ritmo sustentável ao longo dos sete dias."
      defaultTarget={50}
      unitLabels={{
        pages: "páginas por semana",
        minutes: "minutos por semana",
      }}
      getGoal={getWeeklyReadingGoal}
      setGoal={setWeeklyReadingGoal}
      animationDelay={0.2}
      onGoalChange={onGoalChange}
    />
  );
}
