import ReadingHeatMap from "../common/ReadingHeatMap";
import { getReadingEntries } from "../../services/readingService";
import { getRecentReadingDays } from "../../utils/readingActivity";

export default function ReadingDays() {
  const entries = getReadingEntries();
  const readingDays = getRecentReadingDays(entries);

  return (
    <section className="mt-10 border-t border-text/10 pt-6 sm:pt-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Consistência
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-text sm:text-2xl">
            Dias de leitura
          </h2>
        </div>

        <p className="text-sm text-text-muted">Últimos 30 dias</p>
      </div>

      <ReadingHeatMap data={readingDays} />
    </section>
  );
}
