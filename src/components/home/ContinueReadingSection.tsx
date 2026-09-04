import ContinueReadingCard from "./ContinueReadingCard";
import StatsCard from "./StatsCard";
import type { Book } from "../../types/book";
import {
  getReadingEntries,
  getMonthlyReadingGoal,
} from "../../services/readingService";
import { getCurrentReadingStreak } from "../../utils/readingActivity";
import { getProgressForPeriod, getProgressPercent } from "../../utils/goalProgress";


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

  const lastReadAt = lastBook
  ? entries.reduce<string | null>((latestDate, entry) => {
      if (
        entry.bookId !== lastBook.id ||
        Number.isNaN(Date.parse(entry.date))
      ) {
        return latestDate;
      }

      if (
        latestDate === null ||
        Date.parse(entry.date) > Date.parse(latestDate)
      ) {
        return entry.date;
      }

      return latestDate;
    }, null)
  : null;

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:gap-2 mt-6">
      {lastBook && <ContinueReadingCard book={lastBook} lastReadAt={lastReadAt} />}

      <aside className="relative z-10 flex flex-col gap-4 lg:pt-6">
        <StatsCard
          title="Sequência"
          value={`${streak} dia${streak === 1 ? "" : "s"}`}
          subtitle="Lendo sem interrupções"
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
        />

        <StatsCard
          title="Biblioteca"
          value={`${books.length}`}
          subtitle="Livros cadastrados"
        />
      </aside>
    </section>
  );
}
