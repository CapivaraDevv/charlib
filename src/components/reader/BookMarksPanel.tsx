import type { BookMark } from "../../types/bookmark";
import { X, Bookmark as BookmarkIcon } from "lucide-react";
import EmptyState from "../common/EmptyState";

interface BookmarksPanelProps {
  open: boolean;
  bookmarks: BookMark[];
  onClose: () => void;
  onSelect: (page: number) => void;
}

export default function BookmarksPanel({
  open,
  bookmarks,
  onClose,
  onSelect,
}: BookmarksPanelProps) {
  return (
    <aside
      aria-hidden={!open}
      className={`fixed right-0 top-0 z-40 flex h-dvh w-full max-w-sm flex-col border-l border-card-background bg-card-background shadow-2xl transition-transform duration-300 ${
        open ? "visible translate-x-0" : "invisible translate-x-full"
      }`}
    >
      <header className="flex items-center justify-between border-b border-[#3E281D] p-6">
        <div className="flex items-center gap-2">
          <BookmarkIcon size={20} />
          <h2 className="text-xl font-semibold">Marcadores</h2>
        </div>

        <button aria-label="Fechar marcadores" onClick={onClose} className="rounded p-2 hover:bg-white/10">
          <X size={20} />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-6">
        {bookmarks.length === 0 ? (
          <EmptyState
            icon={<BookmarkIcon size={40} />}
            title="Nenhum marcador"
            description="Salve páginas importantes."
          />
        ) : (
          bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => onSelect(bookmark.page)}
              className="cursor-pointer rounded-lg border border-[#3E281D] p-4 text-left transition hover:bg-white/5"
            >
              <p className="font-semibold">Página {bookmark.page}</p>

              <p className="mt-1 text-sm text-gray-400">
                {new Date(bookmark.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
