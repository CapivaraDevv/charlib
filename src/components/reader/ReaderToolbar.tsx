import {
  BookOpen,
  NotebookPen,
  Bookmark,
} from "lucide-react";

type ReaderToolbarProps = {
  readingMode: boolean;
  showControls: boolean;
  onToggleReadingMode: () => void;
  onAddNote: () => void;
  onAddBookmark: () => void;
};

export default function ReaderToolbar({
  readingMode,
  showControls,
  onToggleReadingMode,
  onAddNote,
  onAddBookmark,
}: ReaderToolbarProps) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-surface/95 p-3 shadow-xl backdrop-blur transition-all duration-300 ${
        showControls
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-3"
      }`}
    >
      <button
        onClick={onAddNote}
        className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-surface-hover"
        title="Nova nota"
      >
        <NotebookPen size={22} />
      </button>

      <button
        onClick={onAddBookmark}
        className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-surface-hover"
        title="Adicionar marcador"
      >
        <Bookmark size={22} />
      </button>

      <button
        onClick={onToggleReadingMode}
        className={`flex h-11 items-center gap-2 rounded-xl px-4 transition-colors ${
          readingMode
            ? "bg-primary text-background"
            : "hover:bg-surface-hover"
        }`}
      >
        <BookOpen size={20} />

        <span className="text-sm font-medium">
          {readingMode ? "Sair" : "Modo leitura"}
        </span>
      </button>
    </div>
  );
}