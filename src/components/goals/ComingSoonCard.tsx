import { Flame, Trophy, Target } from "lucide-react";

export default function ComingSoonCard() {
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
      <h2 className="text-2xl font-bold">Jornada de leitura</h2>

      

      <div className="mt-6 space-y-4">
        <div className="rounded-xl bg-black/10 p-4">
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-primary" />

            <h3 className="font-semibold">Sequência de leitura</h3>
          </div>

          <p className="mt-1 text-sm text-white/50">
            Mantenha seu hábito todos os dias.
          </p>
        </div>

        <div className="rounded-xl bg-black/10 p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary" />

            <h3 className="font-semibold">Conquistas</h3>
          </div>

          <p className="mt-1 text-sm text-white/50">
            Desbloqueie marcos da sua jornada.
          </p>
        </div>

        <div className="rounded-xl bg-black/10 p-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />

            <h3 className="font-semibold">Desafios</h3>
          </div>

          <p className="mt-1 text-sm text-white/50">
            Crie desafios semanais e mensais.
          </p>
        </div>
      </div>
    </section>
  );
}
