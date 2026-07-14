import { useNavigate } from "react-router-dom";
import type { Book } from "../../types/book";

interface ReaderHeaderProps {
  book: Book;
}

export default function ReaderHeader({ book }: ReaderHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center px-8 py-5">
      <button
        onClick={() => navigate("/library")}
        className="rounded-md px-3 py-2 hover:bg-white/10"
      >
        ← Biblioteca
      </button>
    </header>
  );
}
