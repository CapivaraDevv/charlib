import {
  BookOpen,
  NotebookPen,
  NotebookText,
  Bookmark,
  BookMarked,
} from "lucide-react";

import Tooltip from "../common/Tooltip";

type ReaderToolbarProps = {
  readingMode: boolean;
  showControls: boolean;
  notesOpen: boolean;
  bookmarksOpen: boolean;
  onToggleReadingMode: () => void;
  onAddNote: () => void;
  onToggleNotes: () => void;
  onAddBookmark: () => void;
  onToggleBookMarks: () => void;
};

export default function ReaderToolbar({
  readingMode,
  showControls,
  notesOpen,
  bookmarksOpen,
  onToggleReadingMode,
  onAddNote,
  onToggleNotes,
  onAddBookmark,
  onToggleBookMarks,
}: ReaderToolbarProps) {
  return (
    <div className="sticky top-0 z-30 w-full px-4 py-3">
    <div
      role="group"
      aria-label="Ferramentas de leitura"
      className={`mx-auto flex w-fit max-w-full items-center gap-1 rounded-2xl border border-text/10 bg-surface/95 p-2 shadow-xl backdrop-blur transition-all duration-300 focus-within:translate-y-0 focus-within:opacity-100 sm:gap-3 sm:p-3 ${
        !readingMode || showControls
          ? "translate-y-0 opacity-100"
          : "-translate-y-3 pointer-events-none opacity-0 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
      }`}
    >
      <Tooltip content="Nova nota">
        <button
          aria-label="Nova nota"
          onClick={onAddNote}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-surface-hover sm:h-11 sm:w-11"
        >
          <NotebookPen size={22} />
        </button>
      </Tooltip>

      <Tooltip content="Notas">
        <button
          aria-label="Notas"
          aria-pressed={notesOpen}
          onClick={onToggleNotes}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors sm:h-11 sm:w-11 ${
            notesOpen
              ? "bg-primary text-background"
              : "hover:bg-surface-hover"
          }`}
        >
          <NotebookText size={22} />
        </button>
      </Tooltip>

      <Tooltip content="Adicionar marcador">
        <button
          aria-label="Adicionar marcador"
          onClick={onAddBookmark}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-surface-hover sm:h-11 sm:w-11"
        >
          <Bookmark size={22} />
        </button>
      </Tooltip>

      <Tooltip content="Meus marcadores">
        <button
          aria-label="Meus marcadores"
          aria-pressed={bookmarksOpen}
          onClick={onToggleBookMarks}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors sm:h-11 sm:w-11 ${
            bookmarksOpen
              ? "bg-primary text-background"
              : "hover:bg-surface-hover"
          }`}
        >
          <BookMarked size={22} />
        </button>
      </Tooltip>

      <Tooltip
        content={readingMode ? "Sair do modo leitura" : "Modo leitura"}
      >
        <button
          aria-label={readingMode ? "Sair do modo leitura" : "Modo leitura"}
          aria-pressed={readingMode}
          onClick={onToggleReadingMode}
          className={`flex h-10 cursor-pointer items-center gap-2 rounded-xl px-3 transition-colors sm:h-11 sm:px-4 ${
            readingMode
              ? "bg-primary text-background"
              : "hover:bg-surface-hover"
          }`}
        >
          <BookOpen size={20} />

          <span className="hidden text-sm font-medium sm:inline">
            {readingMode ? "Sair" : "Modo leitura"}
          </span>
        </button>
      </Tooltip>
    </div>
    </div>
  );
}
