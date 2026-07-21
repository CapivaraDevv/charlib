import Card from "../common/Card";
import ReadingHeatMap from "../common/ReadingHeatMap";
import { readingDays } from "../../data/readingDays";

export default function ReadingDays() {
  return (
    <Card className="mt-8 p-8">
        <h2 className="font-display text-2xl font-bold">
            Dias de leitura
        </h2>

        <ReadingHeatMap data={readingDays} />
    </Card>
  );
}
