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
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            {label}
          </p>
          <p className="mt-1 font-display text-3xl font-bold tabular-nums text-primary">
            {current}
            <span className="ml-1 text-lg font-normal text-white/50">
              / {target}
            </span>
          </p>
          <p className="text-sm text-white/55">{unit}</p>
        </div>

        <div className="text-right">
          <motion.span
            key={percent}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-semibold tabular-nums text-white/90"
          >
            {Math.round(percent)}%
          </motion.span>
        </div>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-[#765242]/60">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            isComplete ? "bg-primary" : "bg-primary/90"
          }`}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}
