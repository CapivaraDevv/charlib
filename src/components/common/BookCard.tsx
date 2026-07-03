import type { Book } from "../../types/book";
import Card from "./Card";
import BookCover from "./BookCover";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card
      classname="
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        cursor-pointer
      "
    >
      <BookCover
        src={book.image}
        alt={book.title}
        className="h-64 w-full"
      />

      <div className="mt-4">
        <h3 className="line-clamp-2 font-display text-lg font-bold">
          {book.title}
        </h3>

        <p className="mt-1 text-sm text-text-muted">
          {book.author}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-primary font-semibold">
            ⭐ {book.rating}
          </span>

          <span className="text-xs text-text-muted">
            {book.pages} pág.
          </span>
        </div>
      </div>
    </Card>
  );
}