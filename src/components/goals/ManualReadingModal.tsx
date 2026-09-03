import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useLibrary } from "../../hooks/useLibrary";
import { recordManualReading } from "../../services/readingService";
import type { ReadingType } from "../../types/reading";

type ManualReadingModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function ManualReadingModal({
  open,
  onClose,
  onSaved,
}: ManualReadingModalProps) {
  const { books } = useLibrary();

  const [bookId, setBookId] = useState("");
  const [type, setType] = useState<ReadingType>("pages");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setBookId("");
    setType("pages");
    setAmount("");
    setError(null);
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      recordManualReading(Number(bookId), type, Number(amount));
      onSaved();
      handleClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível registrar a leitura.",
      );
    }
  }

  return (
    <Modal
      open={open}
      title="Registrar leitura"
      size="sm"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="manual-book"
            className="mb-1 block text-sm text-text-muted"
          >
            Livro
          </label>

          <select
            id="manual-book"
            value={bookId}
            onChange={(event) => setBookId(event.target.value)}
            required
            className="w-full rounded-lg border border-text/15 bg-background px-3 py-2.5 text-text outline-none focus:border-primary"
          >
            <option value="">Selecione um livro</option>

            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="manual-type"
            className="mb-1 block text-sm text-text-muted"
          >
            Unidade
          </label>

          <select
            id="manual-type"
            value={type}
            onChange={(event) => setType(event.target.value as ReadingType)}
            className="w-full rounded-lg border border-text/15 bg-background px-3 py-2.5 text-text outline-none focus:border-primary"
          >
            <option value="pages">Páginas</option>
            <option value="minutes">Minutos</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="manual-amount"
            className="mb-1 block text-sm text-text-muted"
          >
            Quantidade
          </label>

          <input
            id="manual-amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            className="w-full rounded-lg border border-text/15 bg-background px-3 py-2.5 text-text outline-none focus:border-primary"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>

          <Button type="submit">Registrar</Button>
        </div>
      </form>
    </Modal>
  );
}
