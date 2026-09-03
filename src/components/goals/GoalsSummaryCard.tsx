import { motion } from "framer-motion";
import {
  getDailyReadingGoal,
  getWeeklyReadingGoal,
  getMonthlyReadingGoal,
} from "../../services/readingService";
import {
  getProgressForPeriod,
  getProgressPercent,
} from "../../utils/goalProgress";
import ProgressBar from "../common/ProgressBar";

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

  const progressPercent = primaryGoal
    ? getProgressPercent(currentProgress, primaryGoal.target)
    : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-[var(--radius-card)] border border-text/10 bg-surface p-5 sm:p-6 lg:p-8"
    >
      <div className="relative grid gap-6 sm:grid-cols-3">
        <div className="sm:border-r sm:border-text/10 sm:pr-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Metas ativas
          </p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums text-primary">
            {activeCount}
            <span className="text-lg font-normal text-text-muted/70"> / 3</span>
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {activeCount === 0
              ? "Configure sua primeira meta abaixo"
              : activeCount === 3
                ? "Todas as metas configuradas"
                : `${3 - activeCount} meta${3 - activeCount > 1 ? "s" : ""} disponível${3 - activeCount > 1 ? "is" : ""}`}
          </p>
        </div>

        <div className="sm:border-r sm:border-text/10 sm:px-2 sm:pr-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Progresso principal
          </p>
          {primaryGoal ? (
            <>
              <p className="mt-2 font-display text-4xl font-bold tabular-nums text-text">
                {progressPercent}
                <span className="text-lg font-normal text-text-muted/70">%</span>
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {currentProgress} de {primaryGoal.target}{" "}
                {primaryGoal.type === "pages" ? "páginas" : "min"}
              </p>
              <ProgressBar value={progressPercent} className="mt-3" />
            </>
          ) : (
            <>
              <p className="mt-2 font-display text-2xl font-semibold text-text-muted/50">
                —
              </p>
              <p className="mt-1 text-sm text-text-muted">Sem meta prioritária</p>
            </>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
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
                <span className="text-text-muted">{item.label}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.enabled ? "bg-primary" : "bg-text-muted/30"
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
