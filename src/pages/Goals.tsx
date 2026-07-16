import DailyGoalCard from "../components/goals/DailyGoalCard";
import ComingSoonCard from "../components/goals/ComingSoonCard";

export default function Goals() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6">
      <h1 className="crimson-text-regular text-4xl font-bold tracking-wide">
        Seus objetivos
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <DailyGoalCard />

        <ComingSoonCard />
      </div>
    </div>
  );
}
