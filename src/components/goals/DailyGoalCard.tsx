import { useEffect, useState } from "react";
import type { ReadingType, DailyReadingGoal } from "../../types/reading";

import {
  getDailyReadingGoal,
  setDailyReadingGoal,
} from "../../services/readingService";

import { BookOpen } from "lucide-react";

export default function DailyGoalCard() {
  const [type, setType] = useState<ReadingType>("pages");
  const [target, setTarget] = useState(30);
  const [goal, setGoal] = useState<DailyReadingGoal | null>(null);

  useEffect(() => {
    const savedGoal = getDailyReadingGoal();

    if (savedGoal) {
      setGoal(savedGoal);
      setType(savedGoal.type);
      setTarget(savedGoal.target);
    }
  }, []);

  function handleSaveGoal() {
    const newGoal: DailyReadingGoal = {
      enabled: true,
      type,
      target,
    };

    setDailyReadingGoal(newGoal);
    setGoal(newGoal);
  }

  return (
    <section
      className="
        rounded-2xl
        border
        border-[#C49A6C]/20
        bg-[#4A3225]
        p-6
        shadow-lg
      "
    >
      <div>
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-[#C49A6C]" />

          <h2 className="text-2xl font-bold">Meta diária</h2>
        </div>

        <p className="mt-1 text-sm text-white/60">
          Defina quanto você quer ler todos os dias.
        </p>
      </div>

      {goal && (
        <div className="mt-6 rounded-xl bg-black/10 p-4">
          <p className="text-sm text-white/60">Meta atual</p>

          <p className="mt-1 text-3xl font-bold text-[#C49A6C]">
            {goal.target} {goal.type === "pages" ? "páginas" : "minutos"}
          </p>

          <p className="mt-2 text-sm text-white/50">por dia</p>
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm text-white/70">Tipo de meta</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReadingType)}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
              outline-none
            "
          >
            <option value="pages">Páginas</option>

            <option value="minutes">Minutos</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">Quantidade</label>

          <input
            type="number"
            min={1}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
              outline-none
            "
          />
        </div>

        <button
          onClick={handleSaveGoal}
          className="
            w-full
            rounded-xl
            bg-[#C49A6C]
            px-5
            py-3
            font-semibold
            text-[#2B1B14]
            transition
            hover:brightness-110
          "
        >
          Salvar meta
        </button>
      </div>
    </section>
  );
}
