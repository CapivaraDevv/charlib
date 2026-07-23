import { useState } from "react";
import { BookOpen } from "lucide-react";
import Button from "../common/Button";

import type { ReadingType, WeeklyReadingGoal } from "../../types/reading";

import {
  getWeeklyReadingGoal,
  setWeeklyReadingGoal,
} from "../../services/readingService";

export default function WeeklyGoalCard() {
  const initialGoal = getWeeklyReadingGoal();

  const [goal, setGoal] = useState<WeeklyReadingGoal | null>(initialGoal);

  const [type, setType] = useState<ReadingType>(initialGoal?.type ?? "pages");

  const [target, setTarget] = useState(initialGoal?.target ?? 50);

  const [isEditing, setIsEditing] = useState(false);

  function handleSaveGoal() {
    if (target <= 0) return;

    const newGoal: WeeklyReadingGoal = {
      enabled: true,
      type,
      target,
    };

    setWeeklyReadingGoal(newGoal);
    setGoal(newGoal);
    setIsEditing(false);
  }

  function handleRemoveGoal() {
    if (!goal) return;

    const disabledGoal: WeeklyReadingGoal = {
      ...goal,
      enabled: false,
    };

    setWeeklyReadingGoal(disabledGoal);
    setGoal(disabledGoal);
    setIsEditing(false);
  }

  return (
    <section className="rounded-xl border border-white/10 bg-card-background p-6 shadow-lg">
      <header className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />

        <div>
          <h2 className="text-2xl font-semibold">Meta semanal</h2>

          <p className="mt-1 text-sm text-white/60">
            Defina quanto deseja ler semanalmente.
          </p>
        </div>
      </header>

      {goal?.enabled && (
        <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-white/60">Meta atual</p>

          <h3 className="mt-2 text-4xl font-bold text-primary">
            {goal.target}
          </h3>

          <p className="text-white/70">
            {goal.type === "pages" ? "páginas por semana" : "minutos por semana"}
          </p>
        </div>
      )}

      {(!goal?.enabled || isEditing) && (
        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Tipo de meta
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value as ReadingType)}
              className="
                  w-full
                  rounded-lg
                  border
                border-white/10
                  bg-black/20
                  py-3
                  px-4
                  text-foreground
                  outline-none
                  transition-colors
                  focus:border-primary
                "
            >
              <option value="pages" className="bg-background text-foreground">
                Páginas
              </option>

              <option value="minutes" className="bg-background text-foreground">
                Minutos
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Quantidade
            </label>

            <input
              type="number"
              min={1}
              step={1}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="
              w-full
              rounded-lg
              border
              border-white/10
              bg-black/20
              px-5
              py-3
              text-white
              outline-none
              transition-colors
              focus:border-primary
            "
            />
          </div>
        </div>
      )}

      <div className="space-x-2 pt-2">
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
          <Button variant="outline" onClick={handleRemoveGoal} className="mt-3">
            Remover meta
          </Button>
        )}
      </div>
    </section>
  );
}
