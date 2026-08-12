import ContinueReadingCard from "./ContinueReadingCard";
import StatsCard from "./StatsCard";
import { books } from "../../data/books";
import { stats } from "../../data/stats";
import { Flame, BookOpen, Target } from "lucide-react";

export default function ContinueReadingSection() {
  const lastBookId = Number(localStorage.getItem("last-book") ?? books[0]);
  const lastBook = books.find((book) => book.id === lastBookId);

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
          value={`${stats.library}`}
          subtitle="Livros cadastrados"
          icon={<BookOpen size={28} />}
        />
      </aside>
    </section>
  );
}
