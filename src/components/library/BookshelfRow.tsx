import { AnimatePresence } from "framer-motion";
import type { Book } from "../../types/book";
import ShelfBook from "./ShelfBook";

type BookshelfRowProps = {
  books: Book[];
  startIndex: number;
  pullingId: number | null;
  onBookPull: (book: Book) => void;
};

export default function BookshelfRow({
  books,
  startIndex,
  pullingId,
  onBookPull,
}: BookshelfRowProps) {
  return (
    <div className="bookshelf-row relative overflow-visible pt-3">
      <div
        className="flex min-h-[var(--spine-height)] items-end gap-[3px] px-1 pb-0.5 sm:gap-1 sm:px-2"
        style={{ perspective: "900px" }}
      >
        <AnimatePresence mode="popLayout">
          {books.map((book, i) => (
            <ShelfBook
              key={book.id}
              book={book}
              index={startIndex + i}
              isPulling={pullingId === book.id}
              onPull={onBookPull}
            />
          ))}
        </AnimatePresence>
      </div>

      <div
        className="bookshelf-plank relative h-2.5 rounded-sm bg-[#6B4A38] sm:h-3"
        aria-hidden
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      </div>
      <div className="mx-2 mt-0.5 h-0.5 rounded-full bg-[#3d2a1e]/80" aria-hidden />
    </div>
  );
}
