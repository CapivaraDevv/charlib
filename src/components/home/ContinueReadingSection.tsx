import ContinueReadingCard from "./ContinueReadingCard";
import StatsCard from "./StatsCard";
import type { Book } from "../../types/book";
import { stats } from "../../data/stats";
import { Flame, BookOpen, Target } from "lucide-react";

type ContinueReadingSectionProps = {
  books: Book[];
};

export default function ContinueReadingSection({
  books,
}: ContinueReadingSectionProps) {
  const savedBookId = localStorage.getItem("last-book");
  const lastBookId = savedBookId ? Number(savedBookId) : null;

  const lastBook = books.find((book) => book.id === lastBookId) ?? books[0];

  return (
    <section className="grid grid-cols-[2fr_1fr] gap-2">
      {lastBook && <ContinueReadingCard book={lastBook} />}

      <aside className="flex flex-col gap-4 pt-6">
        <StatsCard
          title="Sequência"
          value={`${stats.streak} dias`}
          subtitle="Lendo sem interrupções"
          icon={<Flame size={28} />}
        />

        <StatsCard
          title="Meta do mês"
          value={`${stats.monthly.completed}/${stats.monthly.goal}`}
          subtitle="Livros concluídos"
          icon={<Target size={28} />}
        />

        <StatsCard
          title="Biblioteca"
          value={`${books.length}`}
          subtitle="Livros cadastrados"
          icon={<BookOpen size={28} />}
        />
      </aside>
    </section>
  );
}
