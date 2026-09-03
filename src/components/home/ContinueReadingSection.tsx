import ContinueReadingCard from "./ContinueReadingCard";
import StatsCard from "./StatsCard";
import type { Book } from "../../types/book";
import {
  getReadingEntries,
  getMonthlyReadingGoal,
} from "../../services/readingService";
import { getCurrentReadingStreak } from "../../utils/readingActivity";
import { getProgressForPeriod, getProgressPercent } from "../../utils/goalProgress";
import { Flame, BookOpen, Target } from "lucide-react";

type ContinueReadingSectionProps = {
  books: Book[];
};

export default function ContinueReadingSection({
  books,
}: ContinueReadingSectionProps) {
  const savedBookId = localStorage.getItem("last-book");
  const lastBookId = savedBookId ? Number(savedBookId) : null;
  const entries = getReadingEntries();
  const streak = getCurrentReadingStreak(entries);
  const monthlyGoal = getMonthlyReadingGoal();
  const monthlyProgress = monthlyGoal?.enabled
    ? getProgressForPeriod("monthly", monthlyGoal.type)
    : null;

  const monthlyProgressPercent =
  monthlyGoal?.enabled && monthlyProgress !== null
    ? getProgressPercent(monthlyProgress, monthlyGoal.target)
    : undefined;

  const lastBook = books.find((book) => book.id === lastBookId) ?? books[0];

  return (
    <section className="grid grid-cols-[2fr_1fr] gap-2">
      {lastBook && <ContinueReadingCard book={lastBook} />}

      <aside className="flex flex-col gap-4 pt-6">
        <StatsCard
          title="Sequência"
          value={`${streak} dia${streak === 1 ? "" : "s"}`}
          subtitle="Lendo sem interrupções"
          icon={<Flame size={28} />}
        />

        <StatsCard
          title="Meta do mês"
          progress={monthlyProgressPercent}
          value={
            monthlyGoal?.enabled
              ? `${monthlyProgress}/${monthlyGoal.target}`
              : "Sem meta"
          }
          subtitle={
            monthlyGoal?.enabled
              ? monthlyGoal.type === "pages"
                ? "Páginas lidas"
                : "Minutos lidos"
              : "Configure sua meta mensal"
          }
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
