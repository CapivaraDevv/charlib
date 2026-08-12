interface FilterTabsProps {
  selectedFilter: string;
  onChange: (filter: string) => void;
}

const filters = ["Todos", "Lendo", "Concluídos", "Planejados"];

export default function FilterTabs({
  selectedFilter,
  onChange,
}: FilterTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 sm:mb-8 sm:gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`
            rounded-full px-5 py-2 transition-all
            ${
              selectedFilter === filter
                ? "bg-primary text-background"
                : "bg-surface text-text-muted hover:bg-surface-hover hover:text-white"
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
