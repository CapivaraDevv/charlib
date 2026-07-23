import DailyGoalCard from "../components/goals/DailyGoalCard";
import MonthlyGoalCard from "../components/goals/MonthlyGoalCard";
import ReadingCardStreak from "../components/goals/ReadingCardStreak";
import WeeklyGoalCard from "../components/goals/WeeklyGoalCard";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function Goals() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6">
      <div className="flex flex-row justify-between">
        <h1 className="crimson-text-regular text-4xl font-bold tracking-wide">
          Seus objetivos
        </h1>
        <Button
            onClick={() => navigate("/")}
            variant="primary"
          >
            Voltar
          </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DailyGoalCard />

        <ReadingCardStreak />

        <WeeklyGoalCard />

        <MonthlyGoalCard />
      </div>
    </div>
  );
}
