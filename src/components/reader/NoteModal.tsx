import { useEffect, useState } from "react";
import type { Note } from "../../types/note";
import Modal from "../common/Modal";
import Button from "../common/Button";

type NoteModalProps = {
  open: boolean;
  page: number;
  note?: Note | null;
  onClose: () => void;
  onSave: (content: string) => void;
};

export default function NoteModal({
  open,
  page,
  note,
  onClose,
  onSave,
}: NoteModalProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!open) return;

    setContent(note?.content ?? "");
  }, [open, note]);

  function handleSave() {
    const text = content.trim();

    if (!text) return;

    onSave(text);
    setContent("");
    onClose();
  }

  return (
    <Modal
      open={open}
      title={note ? "Editar nota" : "Nova nota"}
      onClose={onClose}
    >
      <p className="text-text-muted">
        Página {page}
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva sua anotação..."
        className="
          mt-6
          h-40
          w-full
          resize-none
          rounded-xl
          border
          border-white/10
          bg-card-background
          p-4
          outline-none
          focus:border-primary
        "
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancelar
        </Button>

        <Button onClick={handleSave}>
          {note ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </Modal>
  );
}