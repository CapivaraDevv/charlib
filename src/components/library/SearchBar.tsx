import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar livros..."
        className="
          w-full
          rounded-xl
          border
          border-text/10
          bg-surface
          py-3
          pl-12
          pr-4
          text-text
          placeholder:text-text-muted
          outline-none
          transition
          focus:border-primary
          focus:ring-2
          focus:ring-primary/30
        "
      />
    </div>
  );
}