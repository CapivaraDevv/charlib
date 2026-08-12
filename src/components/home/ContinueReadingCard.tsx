import Card from "../common/Card";
import type { Book } from "../../types/book";
import ProgressBar from "../common/ProgressBar";

type ContinueReadingCardProps = {
  book: Book;
};

export default function ContinueReadingCard({
  book,
}: ContinueReadingCardProps) {
  const currentPage =
    Number(localStorage.getItem(`book-progress-${book.id}`)) || book.currentPage;
  const progress = Math.round((currentPage / book.pages) * 100);

  return (
    <Card className="mt-6 flex flex-col p-8">
      <h2 className="mb-6 font-display text-2xl font-bold text-text">
        Continue lendo...
      </h2>

      <div className="flex gap-10">
        <img src={book.image} alt={book.title} className="w-44" />

        <div className="flex flex-1 flex-col">
          <h3 className="font-display text-3xl font-bold text-text lg:text-4xl">
            {book.title}
          </h3>

          <p className="mt-3 text-2xl text-text-muted">{book.author}</p>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-lg text-text">
            <span>⭐ {book.rating} / 5</span>
            <span>
              {currentPage} / {book.pages} páginas
            </span>
            <span>{book.notes} notas</span>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm text-text-muted">
              <span>{progress}%</span>
            </div>

            <ProgressBar value={progress} />
          </div>

          <p className="mt-2 text-text-muted">Última leitura hoje às 20:15</p>

          <button className="mt-auto self-end rounded-xl bg-surface-hover px-6 py-3 font-medium text-text transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-background">
            Continuar leitura →
          </button>
        </div>
      </div>
    </Card>
  );
}
