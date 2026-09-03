import type { Book } from "../../types/book";
import BookCard from "../common/BookCard";
import Card from "../common/Card";
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
    <Card className="mt-8 p-5 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-bold text-text sm:text-2xl">
          Adicionados recentemente
        </h2>

        <Link
          to="/library"
          className="self-start cursor-pointer rounded-2xl bg-primary p-2 font-bold text-background transition hover:bg-primary-hover sm:self-auto"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        {recentBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </Card>
  );
}
