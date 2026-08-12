import { motion } from "framer-motion";

export default function GoalsHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
            Sua sala de leitura
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Objetivos
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-text-muted lg:text-lg">
            Metas diárias, semanais e mensais organizadas como marcadores
            na sua estante pessoal.
          </p>
        </div>

        <div className="hidden shrink-0 lg:block" aria-hidden>
          <div className="relative h-20 w-32">
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-surface-hover/80" />
            <div className="absolute bottom-1 left-2 h-14 w-5 rounded-sm bg-surface shadow-md" />
            <div className="absolute bottom-1 left-9 h-16 w-5 rounded-sm bg-surface-hover shadow-md" />
            <div className="absolute bottom-1 left-16 h-12 w-5 rounded-sm bg-primary/30 shadow-md" />
            <div className="absolute bottom-1 left-[5.75rem] h-[3.75rem] w-5 rounded-sm bg-card-background shadow-md" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-text/10" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted/70">
          metas & progresso
        </span>
        <div className="h-px flex-1 bg-text/10" />
      </div>
    </motion.header>
  );
}
