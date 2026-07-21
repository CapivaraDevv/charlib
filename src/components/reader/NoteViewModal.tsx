import type { Note } from "../../types/note";
import { Pencil, Trash2, X, BookOpen } from "lucide-react";

type NoteViewModalProps = {
  open: boolean;
  note: Note | null;
  onClose: () => void;
  onGoToPage: (page: number) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NoteViewModal({
  open,
  note,
  onClose,
  onGoToPage,
  onEdit,
  onDelete,
}: NoteViewModalProps) {
  if (!open || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Página {note.page}
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              {new Date(note.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-surface-hover"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mt-6 max-h-[50vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-background p-4">
          {note.content}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onDelete(note)}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white hover:opacity-90"
          >
            <Trash2 size={18} />
            Excluir
          </button>

          <button
            onClick={() => onEdit(note)}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-surface-hover px-4 py-2 hover:opacity-90"
          >
            <Pencil size={18} />
            Editar
          </button>

          <button
            onClick={() => onGoToPage(note.page)}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-background hover:opacity-90"
          >
            <BookOpen size={18} />
            Ir para página
          </button>
        </div>
      </div>
    </div>
  );
}