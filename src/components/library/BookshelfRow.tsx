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
    <div className="bookshelf-row relative isolate overflow-visible pt-3 has-[.shelf-book-slot--expanded]:z-40">
      <div
        className="relative z-20 flex min-h-[var(--spine-height)] items-end gap-[3px] overflow-visible px-1 pb-0.5 sm:gap-1 sm:px-2"
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
        className="bookshelf-plank pointer-events-none relative z-0 -mt-0.5 h-2.5 rounded-sm bg-surface-hover sm:h-3"
        aria-hidden
      >
        <div className="absolute inset-x-0 top-0 h-px bg-text/10" />
      </div>
    </div>
  );
}
