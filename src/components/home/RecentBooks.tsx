import type { Book } from "../../types/book";
import BookCard from "../common/BookCard";
import { Link } from "react-router-dom";

type RecentBooksProps = {
  books: Book[];
};

export default function RecentBooks({ books }: RecentBooksProps) {

  const recentBooks = [...books]
  .sort((a, b) => {
    const dateA = Date.parse(a.createdAt ?? "") || 0;
    const dateB = Date.parse(b.createdAt ?? "") || 0;

    return dateB - dateA;
  })
  .slice(0, 4);

  return (
    <section className="mt-10 border-t border-text/10 pt-6 sm:pt-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Biblioteca
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-text sm:text-2xl">
            Adicionados recentemente
          </h2>
        </div>

        <Link
          to="/library"
          className="self-start rounded-xl border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-background sm:self-auto"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {recentBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
