import GoalCard from "./GoalCard";
import {
  getMonthlyReadingGoal,
  setMonthlyReadingGoal,
} from "../../services/readingService";

type MonthlyGoalCardProps = {
  onGoalChange?: () => void;
};

export default function MonthlyGoalCard({ onGoalChange }: MonthlyGoalCardProps) {
  return (
    <GoalCard
      period="monthly"
      periodLabel="Mensal"
      title="Meta mensal"
      description="O panorama do mês — e os livros que ocupam sua estante agora."
      defaultTarget={100}
      unitLabels={{
        pages: "páginas por mês",
        minutes: "minutos por mês",
      }}
      getGoal={getMonthlyReadingGoal}
      setGoal={setMonthlyReadingGoal}
      variant="featured"
      showBookshelf
      animationDelay={0.25}
      onGoalChange={onGoalChange}
    />
  );
}
