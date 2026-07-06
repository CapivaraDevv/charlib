import { useNavigate } from "react-router-dom";
import type { Book } from "../../types/book";
import { Moon, Settings, Bookmark } from "lucide-react";

interface ReaderHeaderProps {
  book: Book;
}

export default function ReaderHeader({ book }: ReaderHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b border-[#3E281D] px-8 py-5">
      {/* Esquerda */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/library")}
          className="rounded-md px-3 py-2 transition hover:bg-white/10"
        >
          ← Biblioteca
        </button>

        <div>
          <h1 className="text-xl font-bold">
            {book.title}
          </h1>

          <p className="text-sm text-gray-400">
            {book.author}
          </p>
        </div>
      </div>

      {/* Direita */}
      <div className="flex items-center gap-3">

        <button 
            aria-label="Favoritar livro"
            className="rounded-md p-2 transition-colors hover:bg-white/10"
        >
          <Bookmark size={20} />
        </button>

        <button 
            aria-label="Alternar tema" 
            className="rounded-md p-2 transition-colors hover:bg-white/10"
        >
          <Moon size={20} />
        </button>

        <button 
            aria-label="Configurações de leitura"
            className="rounded-md p-2 transition-colors hover:bg-white/10"
        >
          <Settings size={20} />
        </button>

      </div>
    </header>
  );
}