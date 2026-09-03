import type { Book } from "../../types/book";
import Card from "./Card";
import BookCover from "./BookCover";
import ProgressBar from "./ProgressBar";


type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const currentPage =
  Number(localStorage.getItem(`book-progress-${book.id}`)) || book.currentPage;
  const progress = ((currentPage / book.pages) * 100)

  return (
    <Card
      className="
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
        className="h-48 w-full sm:h-64"
      />

      <div className="mt-4">
        <h3 className="line-clamp-2 font-display text-lg font-bold text-text">
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

        <ProgressBar value={progress} className="mt-1" />
        <p className="mt-1 text-sm text-text-muted">{currentPage} / {book.pages}</p>
      </div>
    </Card>
  );
}
