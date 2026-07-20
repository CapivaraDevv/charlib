import { useEffect, useState } from "react";
import type { Note } from "../../types/note";


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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl">
        <h2 className="font-display text-2xl font-bold">{note ? "Editar nota" : "Nova nota"}</h2>

        <p className="mt-2 text-text-muted">Página {page}</p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva sua anotação..."
          className="mt-6 h-40 w-full resize-none rounded-xl border border-white/10 bg-background p-4 outline-none focus:border-primary"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-surface-hover px-5 py-2 transition-colors hover:opacity-90"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-primary px-5 py-2 text-background transition-colors hover:opacity-90"
          >
            {note ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}