import { motion } from "framer-motion";
import { Flame, Trophy, Target } from "lucide-react";
import { stats } from "../../data/stats";
import { readingDays } from "../../data/readingDays";

const recentActiveDays = readingDays.filter((d) => d.pages > 0).length;

const journeyItems = [
  {
    icon: Flame,
    title: "Sequência",
    value: `${stats.streak} dias`,
    detail: "Dias consecutivos de leitura",
  },
  {
    icon: Trophy,
    title: "Conquistas",
    value: "Em breve",
    detail: "Marcos desbloqueáveis",
  },
  {
    icon: Target,
    title: "Desafios",
    value: `${recentActiveDays} dias`,
    detail: "Com registro este mês",
  },
];

export default function ReadingCardStreak() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card-background p-6 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#C49A6C]/[0.04] via-transparent to-transparent" />

      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
          Jornada
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold lg:text-3xl">
          Registro de leitura
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/50">
          Sequência, marcos e desafios — em desenvolvimento.
        </p>
      </div>

      <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
        {journeyItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + index * 0.08 }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-white/[0.05] bg-black/15 p-5 transition-colors hover:border-white/[0.1] hover:bg-black/20"
          >
            <div className="flex items-start justify-between">
              <item.icon className="h-5 w-5 text-primary/80" strokeWidth={1.5} />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-white/40">
              {item.title}
            </p>

            <p className="mt-1 font-display text-2xl font-bold text-white">
              {item.value}
            </p>

            <p className="mt-1 text-xs text-white/45">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-6">
        <div className="flex -space-x-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < Math.min(stats.streak, 7)
                  ? "bg-primary/70"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-white/40">
          Visualização simplificada da sequência
        </p>
      </div>
    </motion.section>
  );
}
