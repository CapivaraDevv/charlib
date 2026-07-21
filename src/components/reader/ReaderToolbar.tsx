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
    <div
      className={`fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-surface/95 p-3 shadow-xl backdrop-blur transition-all duration-300 ${
        showControls
          ? "translate-y-0 opacity-100"
          : "-translate-y-3 pointer-events-none opacity-0"
      }`}
    >
      <Tooltip content="Nova nota">
        <button
          onClick={onAddNote}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-surface-hover"
        >
          <NotebookPen size={22} />
        </button>
      </Tooltip>

      <Tooltip content="Notas">
        <button
          onClick={onToggleNotes}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors ${
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
          onClick={onAddBookmark}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-surface-hover"
        >
          <Bookmark size={22} />
        </button>
      </Tooltip>

      <Tooltip content="Meus marcadores">
        <button
          onClick={onToggleBookMarks}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors ${
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
          onClick={onToggleReadingMode}
          className={`flex h-11 cursor-pointer items-center gap-2 rounded-xl px-4 transition-colors ${
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
      </Tooltip>
    </div>
  );
}