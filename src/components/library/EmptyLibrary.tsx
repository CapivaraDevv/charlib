import { Link } from "react-router-dom";
import Button from "../common/Button";
import mouseReadingStack from "../../assets/mascot/mouse-reading-stack.png";

type EmptyLibraryProps = {
  hasActiveFilters?: boolean;
};

export default function EmptyLibrary({
  hasActiveFilters = false,
}: EmptyLibraryProps) {
  return (
    <div className="empty-library py-8">
      <div className="relative mx-auto max-w-lg">
        {!hasActiveFilters && (
          <img
            src={mouseReadingStack}
            alt=""
            aria-hidden="true"
            className="
            pointer-events-none absolute -right-10 -bottom-4 z-0
            hidden h-44 w-auto md:block
            "
          />
        )}
        <div className="relative z-10 space-y-6" aria-hidden>
          {[0, 1].map((row) => (
            <div key={row}>
              <div className="flex min-h-[128px] items-end gap-2 px-4 opacity-30">
                {Array.from({ length: row === 0 ? 6 : 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-7 bg-card-background shadow-[2px_3px_6px_rgba(0,0,0,0.3)]"
                    style={{ height: 80 + (i % 3) * 16 }}
                  />
                ))}
              </div>
              <div className="h-2.5 rounded-sm bg-surface-hover/60" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-xl font-semibold text-text sm:text-2xl">
            {hasActiveFilters ? "Nenhum livro encontrado" : "Estante vazia"}
          </p>

          <p className="mt-2 max-w-xs text-sm text-text-muted">
            {hasActiveFilters
              ? "Tente ajustar a busca ou os filtros."
              : "Adicione o primeiro livro à sua coleção."}
          </p>

          {!hasActiveFilters && (
            <Link to="/adicionar-livro" className="mt-6">
              <Button variant="primary">Adicionar livro</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
