import Card from "../common/Card";

import type { Book } from "../../types/book";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";


import ProgressBar from "../common/ProgressBar";
import mousePeeking from "../../assets/mascot/mouse-peeking.png";

type ContinueReadingCardProps = {
  book: Book;
  lastReadAt: string | null;
};

function formatLastRead(dateString: string | null): string {
  if (!dateString) {
    return "Ainda não há leitura registrada";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Ainda não há leitura registrada";
  }

  
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  if (date.toDateString() === now.toDateString()) {
    return `Hoje às ${time}`;
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ontem às ${time}`;
  }
  
  return `Última leitura em ${date.toLocaleDateString("pt-BR")}`;
}

export default function ContinueReadingCard({
  book,
  lastReadAt,
}: ContinueReadingCardProps) {
  const currentPage =
  Number(localStorage.getItem(`book-progress-${book.id}`)) ||
  book.currentPage;
  
  const progress = Math.round((currentPage / book.pages) * 100);
  const notes = Number(localStorage.getItem(`book-notes-${book.id}`)) || book.notes


  const navigate = useNavigate();
  const lastReadText = formatLastRead(lastReadAt);

  return (
    <div className="relative mt-6">
      <img
        src={mousePeeking}
        alt=""
        aria-hidden="true"
        className="
        pointer-events-none absolute -right-12 top-25 z-10
        hidden w-64 lg:block
      "
      />

      <Card className="flex flex-col border border-text/10 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="mt-1 font-display text-xl font-bold text-text sm:text-2xl">
              Continue lendo
            </h2>
          </div>

          <span className="text-sm font-medium tabular-nums text-primary">
            {progress}%
          </span>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <img
            src={book.image}
            alt={book.title}
            className="mx-auto w-32 rounded-2xl border border-text/10 object-cover shadow-lg sm:mx-0 sm:w-40"
          />

          <div className="flex flex-1 flex-col">
            <h3 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
              {book.title}
            </h3>

            <p className="mt-3 text-lg text-text-muted sm:text-2xl">
              {book.author}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted sm:gap-5 sm:text-base">
              <span className="flex items-center gap-1.5 text-text">
                <Star size={16} className="text-primary" fill="currentColor" />
                {book.rating} / 5
              </span>

              <span>
                {currentPage} / {book.pages} páginas
              </span>

              <span>{notes} notas</span>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm text-text-muted">
                <span>Progresso de leitura</span>
              </div>

              <ProgressBar value={progress} />
            </div>

            <p className="mt-2 text-text-muted">{lastReadText}</p>

            <div className="flex mt-4">
              <Button type="button" onClick={() => navigate(`/library/${book.id}`)} className="w-full sm:w-auto">
                Continuar lendo
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
