import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import type { Book } from "../../types/book";
import { splitIntoRows } from "../../utils/bookshelf";
import { useBooksPerRow } from "../../hooks/useBooksPerRow";
import BookshelfRow from "./BookshelfRow";
import EmptyLibrary from "./EmptyLibrary";

type BookshelfProps = {
  books: Book[];
  hasActiveFilters?: boolean;
};

export default function Bookshelf({ books, hasActiveFilters = false }: BookshelfProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const booksPerRow = useBooksPerRow();
  const [pullingId, setPullingId] = useState<number | null>(null);

  const rows = useMemo(
    () => splitIntoRows(books, booksPerRow),
    [books, booksPerRow]
  );

  const handleBookPull = useCallback(
    (book: Book) => {
      if (pullingId !== null) return;

      setPullingId(book.id);

      const delay = reducedMotion ? 0 : 480;

      window.setTimeout(() => {
        navigate(`/library/${book.id}`);
      }, delay);
    },
    [navigate, pullingId, reducedMotion]
  );

  if (books.length === 0) {
    return <EmptyLibrary hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <div className="bookshelf relative overflow-visible">
      <div className="space-y-8 overflow-visible sm:space-y-10">
        {rows.map((rowBooks, rowIndex) => (
          <BookshelfRow
            key={`row-${rowIndex}-${rowBooks.map((b) => b.id).join("-")}`}
            books={rowBooks}
            startIndex={rowIndex * booksPerRow}
            pullingId={pullingId}
            onBookPull={handleBookPull}
          />
        ))}
      </div>
    </div>
  );
}
