import { motion } from "framer-motion";

type GoalProgressDisplayProps = {
  current: number;
  target: number;
  unit: string;
  label?: string;
};

export default function GoalProgressDisplay({
  current,
  target,
  unit,
  label = "Progresso",
}: GoalProgressDisplayProps) {
  const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const isComplete = current >= target && target > 0;

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            {label}
          </p>
          <p className="mt-1 font-display text-3xl font-bold tabular-nums text-primary">
            {current}
            <span className="ml-1 text-lg font-normal text-text-muted">
              / {target}
            </span>
          </p>
          <p className="text-sm text-text-muted">{unit}</p>
        </div>

        <div className="text-right">
          <motion.span
            key={percent}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-semibold tabular-nums text-text"
          >
            {Math.round(percent)}%
          </motion.span>
        </div>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-hover/70">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            isComplete ? "bg-primary" : "bg-primary/90"
          }`}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
