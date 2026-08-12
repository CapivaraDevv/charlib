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
      className="relative overflow-hidden rounded-[var(--radius-card)] border border-text/10 bg-card-background p-6 lg:p-8"
    >
      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-text-muted">
          Jornada
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-text lg:text-3xl">
          Registro de leitura
        </h2>
        <p className="mt-2 max-w-xl text-sm text-text-muted">
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
            className="rounded-xl border border-text/10 bg-background/40 p-5 transition-colors hover:border-text/15 hover:bg-background/55"
          >
            <div className="flex items-start justify-between">
              <item.icon className="h-5 w-5 text-primary/80" strokeWidth={1.5} />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-text-muted">
              {item.title}
            </p>

            <p className="mt-1 font-display text-2xl font-bold text-text">
              {item.value}
            </p>

            <p className="mt-1 text-xs text-text-muted">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-6 flex items-center gap-3 border-t border-text/10 pt-6">
        <div className="flex -space-x-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < Math.min(stats.streak, 7)
                  ? "bg-primary/80"
                  : "bg-text-muted/25"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-text-muted">
          Visualização simplificada da sequência
        </p>
      </div>
    </motion.section>
  );
}
