import type { readingDay } from "../../types/readingDay";

type ReadingHeatMapProps = {
  data: readingDay[];
};

function getColor(pages: number) {
  if (pages === 0) return "bg-text/10";
  if (pages <= 10) return "bg-surface-hover";
  if (pages <= 30) return "bg-surface";
  return "bg-primary";
}

export default function ReadingHeatMap({ data }: ReadingHeatMapProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {data.map((day) => (
        <div
          key={day.date}
          className={`h-5 w-5 rounded-sm transition-colors ${getColor(day.pages)}`}
          title={`${day.date} - ${day.pages} páginas`}
        />
      ))}
    </div>
  );
}
