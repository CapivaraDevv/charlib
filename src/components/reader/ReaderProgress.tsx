import type { Book } from "../../types/book";
import ProgressBar from "../common/LinearProgress";

interface ReaderProgressProps {
  book: Book;
}

export default function ReaderProgress({ book }: ReaderProgressProps) {
  const progress =
    book.pages > 0
      ? Math.round((book.currentPage / book.pages) * 100)
      : 0;

  return (
    <div className="w-full max-w-xl">
      <div className="mb-2 flex justify-between text-sm text-gray-400">
        <span>
          Página {book.currentPage} de {book.pages}
        </span>

        <span>{progress}%</span>
      </div>

      <ProgressBar value={progress} />
    </div>
  );
}