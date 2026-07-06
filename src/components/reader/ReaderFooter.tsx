import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "../../types/book";
import ReaderProgress from "./ReaderProgress";

interface ReaderFooterProps {
  book: Book;
}

export default function ReaderFooter({
  book,
}: ReaderFooterProps) {
  return (
    <footer className="border-t border-[#3E281D] px-8 py-6">

      <div className="flex items-center gap-6">

        <button
          disabled
          className="rounded-md p-2 opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </button>

        <div className="flex-1">
          <ReaderProgress book={book} />
        </div>

        <button
          disabled
          className="rounded-md p-2 opacity-40"
          aria-label="Próxima página"
        >
          <ChevronRight />
        </button>

      </div>

    </footer>
  );
}