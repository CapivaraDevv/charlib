import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { books } from "../../data/books";

type MiniBookshelfProps = {
  pulseKey?: number;
  maxBooks?: number;
};

const readingBooks = books.filter((book) => book.status === "reading");

export default function MiniBookshelf({
  pulseKey = 0,
  maxBooks = 5,
}: MiniBookshelfProps) {
  const shelfBooks = readingBooks.slice(0, maxBooks);

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
          Em leitura
        </p>
      </div>

      <motion.div
        key={pulseKey}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        className="relative rounded-xl bg-background/60 px-4 pb-3 pt-5"
      >
        <div className="flex min-h-[72px] items-end justify-start gap-2">
          <AnimatePresence mode="popLayout">
            {shelfBooks.length > 0 ? (
              shelfBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, y: 24, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative"
                  title={`${book.title} — ${book.author}`}
                >
                  <div className="h-14 w-9 overflow-hidden rounded-sm shadow-md ring-1 ring-background/40 transition-transform duration-300 group-hover:-translate-y-1">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pb-2 text-sm text-text-muted"
              >
                Nenhum livro em leitura no momento.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-3 h-1.5 rounded-sm bg-surface-hover shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" />
        <div className="mx-1 mt-0.5 h-0.5 rounded-full bg-text/10" />
      </motion.div>
      <Link
          to="/library"
          className="text-xs text-primary/80 transition-colors hover:text-primary-hover"
        >
          Ver biblioteca
        </Link>
    </div>
  );
}
