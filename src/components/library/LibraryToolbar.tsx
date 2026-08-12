import Dropdown from "../common/Dropdown";
import Button from "../common/Button";

type LibraryToolbarProps = {
  bookCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
};

const sortLabels: Record<string, string> = {
  progress: "Progresso",
  rating: "Nota",
  title: "Título",
};

export default function LibraryToolbar({
  bookCount,
  sortBy,
  onSortChange,
}: LibraryToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-white/50">
        {bookCount} {bookCount === 1 ? "livro" : "livros"}
        {sortBy !== "progress" && (
          <span className="text-white/35">
            {" "}
            · ordenado por {sortLabels[sortBy]?.toLowerCase()}
          </span>
        )}
      </p>

      <Dropdown
        trigger={
          <Button variant="outline" className="w-auto text-sm">
            Ordenar: {sortLabels[sortBy]}
          </Button>
        }
        items={[
          {
            id: "progress",
            label: "Progresso",
            onClick: () => onSortChange("progress"),
          },
          {
            id: "rating",
            label: "Nota",
            onClick: () => onSortChange("rating"),
          },
          {
            id: "title",
            label: "Título",
            onClick: () => onSortChange("title"),
          },
        ]}
      />
    </div>
  );
}
