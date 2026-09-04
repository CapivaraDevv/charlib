import { motion } from "framer-motion";
import bookStack from "../../assets/decorations/book-stack.png";

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

        <img
          src={bookStack}
          alt=""
          aria-hidden="true"
          className="pointer-events-none hidden h-36 w-auto opacity-75 lg:block"
        />
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
