import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import Button from "../common/Button";

import type { ReadingType, DailyReadingGoal } from "../../types/reading";

import {
  getDailyReadingGoal,
  setDailyReadingGoal,
} from "../../services/readingService";

export default function DailyGoalCard() {
  const [type, setType] = useState<ReadingType>("pages");
  const [target, setTarget] = useState(30);
  const [goal, setGoal] = useState<DailyReadingGoal | null>(null);

  useEffect(() => {
    const savedGoal = getDailyReadingGoal();

    if (!savedGoal) return;

    setGoal(savedGoal);
    setType(savedGoal.type);
    setTarget(savedGoal.target);
  }, []);

  function handleSaveGoal() {
    if (target <= 0) return;

    const newGoal: DailyReadingGoal = {
      enabled: true,
      type,
      target,
    };

    setDailyReadingGoal(newGoal);
    setGoal(newGoal);
  }

  function handleRemoveGoal() {
    if (!goal) return;

    const disabledGoal = {
      ...goal,
      enabled: false,
    };

    setDailyReadingGoal(disabledGoal);
    setGoal(disabledGoal);
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#4A3225] p-6">
      <header className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />

        <div>
          <h2 className="text-2xl font-semibold">Meta diária</h2>

          <p className="mt-1 text-sm text-white/60">
            Defina quanto deseja ler todos os dias.
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
            {goal.type === "pages" ? "páginas por dia" : "minutos por dia"}
          </p>
        </div>
      )}

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
          <label className="mb-2 block text-sm text-white/70">Quantidade</label>

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
              px-4
              py-3
              text-white
              outline-none
              transition-colors
              focus:border-primary
            "
          />
        </div>

        <Button variant="primary" onClick={handleSaveGoal} className="mt-3">
            Salvar meta
        </Button>

        {goal?.enabled && (
          <Button variant="outline" onClick={handleRemoveGoal} className="mt-3">
            Remover meta
          </Button>
        )}
      </div>
    </section>
  );
}
