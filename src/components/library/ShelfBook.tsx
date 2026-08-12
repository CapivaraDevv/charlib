import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Book } from "../../types/book";
import {
  getBookProgress,
  getSpineWidth,
  getSpineTilt,
} from "../../utils/bookshelf";

type ShelfBookProps = {
  book: Book;
  index: number;
  isPulling: boolean;
  onPull: (book: Book) => void;
};

const STATUS_CLASS: Record<Book["status"], string> = {
  reading: "shelf-book--reading",
  completed: "shelf-book--completed",
  planned: "shelf-book--planned",
};

export default function ShelfBook({
  book,
  index,
  isPulling,
  onPull,
}: ShelfBookProps) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const spineWidth = getSpineWidth(book.id);
  const tilt = getSpineTilt(index);
  const progress = getBookProgress(book);
  const isExpanded = (hovered || focused) && !isPulling;
  const duration = reducedMotion ? 0 : 0.32;

  function handleClick() {
    onPull(book);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPull(book);
    }
  }

  return (
    <motion.div
      layout
      layoutId={`shelf-book-${book.id}`}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -8, scale: 0.92, transition: { duration: 0.25 } }
      }
      transition={{
        duration: 0.35,
        delay: reducedMotion ? 0 : index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`shelf-book-slot ${isExpanded || isPulling ? "z-30" : "z-10"}`}
    >
      <motion.button
        type="button"
        aria-label={`${book.title}, ${book.author}, ${progress} por cento concluído`}
        aria-pressed={isPulling}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`shelf-book group relative origin-bottom cursor-pointer touch-manipulation border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${STATUS_CLASS[book.status]}`}
        style={{
          transformStyle: "preserve-3d",
          perspective: 600,
        }}
        animate={
          isPulling
            ? {
                y: reducedMotion ? 0 : -32,
                scale: reducedMotion ? 1.05 : 1.18,
                rotateY: reducedMotion ? 0 : -12,
                rotateZ: 0,
                zIndex: 50,
              }
            : isExpanded
              ? {
                  y: reducedMotion ? -4 : -14,
                  scale: reducedMotion ? 1.02 : 1.06,
                  rotateY: reducedMotion ? 0 : -18,
                  rotateZ: tilt * 0.5,
                  zIndex: 20,
                }
              : {
                  y: 0,
                  scale: 1,
                  rotateY: 0,
                  rotateZ: tilt,
                  zIndex: 1,
                }
        }
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      >
        <motion.div
          className="relative"
          animate={
            isPulling
              ? { boxShadow: "0 24px 48px rgba(0,0,0,0.55)" }
              : isExpanded
                ? { boxShadow: "0 16px 32px rgba(0,0,0,0.4)" }
                : { boxShadow: "2px 4px 10px rgba(0,0,0,0.4)" }
          }
          transition={{ duration }}
        >
          {/* Lombada */}
          <div
            className="shelf-book-spine relative overflow-hidden"
            style={{ width: spineWidth }}
          >
            <img
              src={book.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-[500%] max-w-none object-cover object-left"
            />
            <div className="absolute inset-0 bg-black/40" aria-hidden />
            <div className="absolute inset-x-0 top-0 h-0.5 bg-white/15" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40" aria-hidden />

            {book.status === "reading" && (
              <div
                className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary/80"
                aria-hidden
              />
            )}

            <p
              className="absolute inset-x-0 bottom-2 top-2 flex items-center justify-center px-0.5 text-[8px] font-medium uppercase tracking-wider text-white/85 sm:text-[9px]"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              aria-hidden
            >
              <span className="line-clamp-5 sm:line-clamp-6">{book.title}</span>
            </p>
          </div>

          {/* Capa revelada no hover / pull */}
          <AnimatePresence>
            {(isExpanded || isPulling) && (
              <motion.div
                initial={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, x: -6, rotateY: -20 }
                }
                animate={{
                  opacity: 1,
                  x: isPulling ? spineWidth + 6 : spineWidth + 4,
                  rotateY: 0,
                  scale: isPulling ? 1.05 : 1,
                }}
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: -6, rotateY: -15 }
                }
                transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`overflow-hidden shadow-[4px_8px_16px_rgba(0,0,0,0.45)] ${
                    isPulling ? "w-[88px] sm:w-[96px]" : "w-[68px] sm:w-[76px]"
                  }`}
                >
                  <img
                    src={book.image}
                    alt=""
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>

                <div className="mt-2 w-[88px] text-left sm:w-[96px]">
                  <p className="line-clamp-2 font-display text-[11px] font-semibold leading-tight text-white sm:text-xs">
                    {book.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-white/55">
                    {book.author}
                  </p>
                  <p className="mt-1 text-[10px] font-medium tabular-nums text-primary">
                    {progress}% concluído
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
