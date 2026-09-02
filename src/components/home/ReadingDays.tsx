import Card from "../common/Card";
import ReadingHeatMap from "../common/ReadingHeatMap";
import { getReadingEntries } from "../../services/readingService";
import { getRecentReadingDays } from "../../utils/readingActivity";

export default function ReadingDays() {
  const entries = getReadingEntries();
  const readingDays = getRecentReadingDays(entries);

  return (
    <Card className="mt-8 p-8">
        <h2 className="font-display text-2xl font-bold text-text">
            Dias de leitura
        </h2>

        <ReadingHeatMap data={readingDays} />
    </Card>
  );
}
