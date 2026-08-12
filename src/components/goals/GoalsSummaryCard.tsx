import { motion } from "framer-motion";
import {
  getDailyReadingGoal,
  getWeeklyReadingGoal,
  getMonthlyReadingGoal,
} from "../../services/readingService";
import { getProgressForPeriod } from "../../utils/goalProgress";

export default function GoalsSummaryCard() {
  const daily = getDailyReadingGoal();
  const weekly = getWeeklyReadingGoal();
  const monthly = getMonthlyReadingGoal();

  const activeGoals = [daily, weekly, monthly].filter((g) => g?.enabled);
  const activeCount = activeGoals.length;

  const primaryGoal = daily?.enabled
    ? daily
    : weekly?.enabled
      ? weekly
      : monthly?.enabled
        ? monthly
        : null;

  const primaryPeriod = daily?.enabled
    ? "daily"
    : weekly?.enabled
      ? "weekly"
      : monthly?.enabled
        ? "monthly"
        : null;

  const currentProgress =
    primaryGoal && primaryPeriod
      ? getProgressForPeriod(primaryPeriod, primaryGoal.type)
      : 0;

  const progressPercent =
    primaryGoal && primaryGoal.target > 0
      ? Math.min(100, Math.round((currentProgress / primaryGoal.target) * 100))
      : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#3d2a1e] p-6 lg:p-8"
    >
      {/* <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/[0.04]" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-[#C49A6C]/[0.06]" /> */}

      <div className="relative grid gap-6 sm:grid-cols-3">
        <div className="sm:border-r sm:border-white/[0.06] sm:pr-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            Metas ativas
          </p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums text-primary">
            {activeCount}
            <span className="text-lg font-normal text-white/35"> / 3</span>
          </p>
          <p className="mt-1 text-sm text-white/50">
            {activeCount === 0
              ? "Configure sua primeira meta abaixo"
              : activeCount === 3
                ? "Todas as metas configuradas"
                : `${3 - activeCount} meta${3 - activeCount > 1 ? "s" : ""} disponível${3 - activeCount > 1 ? "is" : ""}`}
          </p>
        </div>

        <div className="sm:border-r sm:border-white/[0.06] sm:px-2 sm:pr-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            Progresso principal
          </p>
          {primaryGoal ? (
            <>
              <p className="mt-2 font-display text-4xl font-bold tabular-nums text-white">
                {progressPercent}
                <span className="text-lg font-normal text-white/35">%</span>
              </p>
              <p className="mt-1 text-sm text-white/50">
                {currentProgress} de {primaryGoal.target}{" "}
                {primaryGoal.type === "pages" ? "páginas" : "min"}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 font-display text-2xl font-semibold text-white/30">
                —
              </p>
              <p className="mt-1 text-sm text-white/50">Sem meta prioritária</p>
            </>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            Períodos
          </p>
          <ul className="mt-3 space-y-2">
            {[
              { label: "Diária", enabled: daily?.enabled },
              { label: "Semanal", enabled: weekly?.enabled },
              { label: "Mensal", enabled: monthly?.enabled },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white/60">{item.label}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.enabled ? "bg-primary" : "bg-white/15"
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
