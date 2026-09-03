import Card from "../common/Card";
import ReadingHeatMap from "../common/ReadingHeatMap";
import { getReadingEntries } from "../../services/readingService";
import { getRecentReadingDays } from "../../utils/readingActivity";

export default function ReadingDays() {
  const entries = getReadingEntries();
  const readingDays = getRecentReadingDays(entries);

  return (
    <Card className="mt-8 p-5 sm:p-8">
        <h2 className="font-display text-xl font-bold text-text sm:text-2xl">
            Dias de leitura
        </h2>

        <ReadingHeatMap data={readingDays} />
    </Card>
  );
}
