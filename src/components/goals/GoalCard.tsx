import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import GoalProgressDisplay from "./GoalProgressDisplay";
import MiniBookshelf from "./MiniBookshelf";
import type { ReadingType } from "../../types/reading";
import {
  getProgressForPeriod,
  type GoalPeriod,
} from "../../utils/goalProgress";

type GoalConfig = {
  enabled: boolean;
  type: ReadingType;
  target: number;
};

type GoalCardProps = {
  period: GoalPeriod;
  periodLabel: string;
  title: string;
  description: string;
  defaultTarget: number;
  unitLabels: { pages: string; minutes: string };
  getGoal: () => GoalConfig | null;
  setGoal: (goal: GoalConfig) => void;
  variant?: "default" | "featured";
  showBookshelf?: boolean;
  animationDelay?: number;
  onGoalChange?: () => void;
};

export default function GoalCard({
  period,
  periodLabel,
  title,
  defaultTarget,
  unitLabels,
  getGoal,
  setGoal,
  variant = "default",
  showBookshelf = false,
  animationDelay = 0,
  onGoalChange,
}: GoalCardProps) {
  const initialGoal = getGoal();

  const [goal, setGoalState] = useState<GoalConfig | null>(initialGoal);
  const [type, setType] = useState<ReadingType>(initialGoal?.type ?? "pages");
  const [target, setTarget] = useState(initialGoal?.target ?? defaultTarget);
  const [isEditing, setIsEditing] = useState(false);
  const [shelfPulse, setShelfPulse] = useState(0);

  const isFeatured = variant === "featured";

  const currentProgress =
    goal?.enabled && goal.type
      ? getProgressForPeriod(period, goal.type)
      : 0;

  const unit =
    goal?.type === "minutes" ? unitLabels.minutes : unitLabels.pages;

  function handleSaveGoal() {
    if (target <= 0) return;

    const newGoal: GoalConfig = {
      enabled: true,
      type,
      target,
    };

    setGoal(newGoal);
    setGoalState(newGoal);
    setIsEditing(false);
    setShelfPulse((prev) => prev + 1);
    onGoalChange?.();
  }

  function handleRemoveGoal() {
    if (!goal) return;

    const disabledGoal = {
      ...goal,
      enabled: false,
    };

    setGoal(disabledGoal);
    setGoalState(disabledGoal);
    setIsEditing(false);
    onGoalChange?.();
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: animationDelay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2 }}
      className={`
        group relative overflow-hidden rounded-2xl border border-white/[0.08]
        bg-card-background shadow-[0_8px_32px_rgba(0,0,0,0.18)]
        transition-shadow duration-300 hover:border-white/[0.12]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.24)]
        ${isFeatured ? "p-8 lg:p-9" : "p-6 lg:p-7"}
      `}
    >

      <header className="relative">
        <h2
          className={`mt-2 font-display font-bold tracking-tight text-white ${
            isFeatured ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
          }`}
        >
          {title}
        </h2>
      </header>

      <AnimatePresence mode="wait">
        {goal?.enabled && !isEditing ? (
          <motion.div
            key="display"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="relative mt-6 rounded-xl border border-white/[0.06] bg-black/15 p-5">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Meta definida
              </p>

              <motion.p
                key={goal.target}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 font-display text-5xl font-bold tabular-nums text-primary"
              >
                {goal.target}
              </motion.p>

              <p className="text-sm text-white/60">{unit}</p>

              <GoalProgressDisplay
                current={currentProgress}
                target={goal.target}
                unit={unit}
              />
            </div>

            {showBookshelf && <MiniBookshelf pulseKey={shelfPulse} />}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative mt-6"
          >
            {!goal?.enabled && (
              <div className="mb-5 rounded-xl border border-dashed border-white/10 bg-black/10 px-5 py-4">
                <p className="text-sm text-white/50">
                  Nenhuma meta {periodLabel.toLowerCase()} configurada.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
                  Tipo
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ReadingType)}
                  className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-foreground outline-none transition-colors focus:border-primary/60"
                >
                  <option value="pages" className="bg-background">
                    Páginas
                  </option>
                  <option value="minutes" className="bg-background">
                    Minutos
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
                  Quantidade
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition-colors focus:border-primary/60"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {goal?.enabled && !isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Editar meta
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSaveGoal}>
            {goal?.enabled ? "Salvar alterações" : "Criar meta"}
          </Button>
        )}

        {goal?.enabled && (
          <Button variant="outline" onClick={handleRemoveGoal}>
            Remover meta
          </Button>
        )}
      </div>
    </motion.article>
  );
}
