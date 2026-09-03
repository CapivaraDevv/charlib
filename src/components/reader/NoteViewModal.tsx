import type { Note } from "../../types/note";
import { Pencil, Trash2, BookOpen } from "lucide-react";

import Button from "../common/Button";
import Modal from "../common/Modal";

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
  if (!note) return null;

  return (
    <Modal
      open={open}
      title={`Página ${note.page}`}
      size="lg"
      onClose={onClose}
    >
      <p className="text-sm text-text-muted">
        {new Date(note.createdAt).toLocaleDateString("pt-BR")}
      </p>

      <div className="mt-6 max-h-[50vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-background p-4">
        {note.content}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          onClick={() => onDelete(note)}
          variant="danger"
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Trash2 size={18} />
          Excluir
        </Button>

        <Button
          onClick={() => onEdit(note)}
          variant="outline"
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Pencil size={18} />
          Editar
        </Button>

        <Button
          onClick={() => onGoToPage(note.page)}
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <BookOpen size={18} />
          Ir para página
        </Button>
      </div>
    </Modal>
  );
}
