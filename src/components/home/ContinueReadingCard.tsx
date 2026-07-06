import Card from "../common/Card";
import type { Book } from "../../types/book";
import ProgressBar from "../common/LinearProgress";

type ContinueReadingCardProps = {
  book: Book;
};

export default function ContinueReadingCard({
  book,
}: ContinueReadingCardProps) {
  const progress = Math.round((book.currentPage / book.pages) * 100);
  return (
    <Card classname="mt-10 flex flex-col p-8">
      <h2 className="mb-6 font-display text-2xl font-bold">
        Continue lendo...
      </h2>

      <div className="flex gap-10">
        <img
          src={book.image}
          alt={book.title}
          className="w-44"
        />

        <div className="flex flex-1 flex-col">
          <h3 className="font-display text-3xl font-bold lg:text-4xl">
            {book.title}
          </h3>

          <p className="mt-3 text-2xl text-white/80">{book.author}</p>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-lg text-white/90">
            <span>⭐ {book.rating} / 5</span>
            <span>
              {book.currentPage} / {book.pages} páginas
            </span>
            <span>{book.notes} notas</span>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm">
              <span>{progress}%</span>
            </div>

            <ProgressBar value={progress} />
          </div>

          <p className="mt-2 text-white/70">Última leitura hoje às 20:15</p>

          <button className="mt-auto self-end rounded-xl bg-[#8A5A44] px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-[#A66B50]">
            Continuar leitura →
          </button>
        </div>
      </div>
    </Card>
  );
}
