import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import type { Book } from "../types/book";
import { saveBook, updateBook } from "../services/libraryService";
import { useLibrary } from "../hooks/useLibrary";
import mouseCarryingBooks from "../assets/mascot/mouse-carrying-books.png";
import booksCorner from "../assets/decorations/books-corner.png";

const MAX_PDF_SIZE = 25 * 1024 * 1024;
const MAX_COVER_SIZE = 5 * 1024 * 1024;
const VALID_COVER_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function AddBook({ book }: { book?: Book }) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [pages, setPages] = useState(book ? String(book.pages) : "");
  const [status, setStatus] = useState<Book["status"]>(book?.status ?? "planned");
  const [removeCover, setRemoveCover] = useState(false);
  const [pdf, setPdf] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { reloadBooks } = useLibrary();

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);


    const pageCount = Number(pages);

    if (!title.trim() || !author.trim()) {
      setError("Preencha o título e o autor.");
      return;
    }

    if (!Number.isInteger(pageCount) || pageCount < 1) {
      setError("Informe uma quantidade válida de páginas.");
      return;
    }

    if (!pdf && !book) {
      setError("Selecione o PDF do livro.");
      return;
    }

    const isPdf =
      !pdf || pdf.type === "application/pdf" || pdf.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Selecione um arquivo PDF válido.");
      return;
    }

    if (pdf && pdf.size > MAX_PDF_SIZE) {
      setError("O PDF deve ter no máximo 25 MB.");
      return;
    }

    if (cover && !VALID_COVER_TYPES.includes(cover.type)) {
      setError("A capa deve estar no formato PNG, JPG ou WebP.");
      return;
    }

    if (cover && cover.size > MAX_COVER_SIZE) {
      setError("A capa deve ter no máximo 5 MB.");
      return;
    }

    try {
      setIsSaving(true);

      const details = {
        title,
        author,
        pages: pageCount,
        status,
      };
      if (book) {
        await updateBook(book.id, {
          ...details,
          file: pdf ?? undefined,
          cover: removeCover ? null : cover ?? undefined,
        });
      } else if (pdf) {
        await saveBook({ ...details, file: pdf, cover });
      }

      await reloadBooks();

      navigate(book ? `/library/${book.id}` : "/library");

    } catch {
      setError(
        "Não foi possível salvar o livro. Verifique o espaço disponível e tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl ">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <img
            src={mouseCarryingBooks}
            alt=""
            aria-hidden="true"
            className="pointer-events-none order-last h-28 w-32 shrink-0 self-end object-contain sm:h-36 sm:w-40"
          />

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Sua coleção
            </p>

            <h1 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">
              {book ? "Editar livro" : "Adicionar livro"}
            </h1>

            <p className="mt-3 max-w-2xl text-text-muted">
              {book ? "Atualize os dados do livro. Os arquivos atuais serão mantidos se você não selecionar outros." : "Cadastre um PDF para começar a leitura e acompanhar seu progresso."}
            </p>
          </div>
        </header>

        <Card className="relative mt-8 overflow-hidden border border-text/10 p-6 shadow-xl sm:p-8">

          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="space-y-2">
              <label htmlFor="book-title" className="block ">
                Título
              </label>
              <Input
                id="book-title"
                placeholder="Digite o título"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="book-author">Digite qual o autor do livro</label>
              <Input
                id="book-author"
                placeholder="Digite o autor"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="book-pages">
                  Digite a quantidade de páginas
                </label>
                <Input
                  id="book-pages"
                  type="number"
                  min="1"
                  step="1"
                  value={pages}
                  onChange={(event) => setPages(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="book-status">Escolha o status do livro</label>
                <select
                  className="
                    w-full rounded-xl border border-text/10
                  bg-background px-4 py-3 text-text
                    outline-none transition-colors
                  focus:border-primary
                    "
                  id="book-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as Book["status"])
                  }
                >
                  <option value="reading">Lendo</option>
                  <option value="planned">Planejado</option>
                  <option value="completed">Finalizado</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* upload PDF */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-text">
                  Arquivo de leitura
                </p>

                <label
                  htmlFor="book-file"
                  className="
                    relative flex min-h-32 cursor-pointer flex-col
                    items-center justify-center overflow-hidden
                    rounded-xl border border-dashed border-primary/40
                    bg-background/40 px-6 text-center
                    transition-colors hover:border-primary
                    hover:bg-background/70
                    focus-within:border-primary
                    focus-within:ring-2 focus-within:ring-primary/30
                "
                >
                  <span className="font-medium text-primary">
                    Selecionar PDF
                  </span>

                  <span className="mt-1 max-w-full truncate text-xs text-text-muted">
                    {pdf ? pdf.name : book ? "Manter PDF atual" : "Arquivo no formato PDF"}
                  </span>

                  <input
                    id="book-file"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(event) =>
                      setPdf(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
              {/* upload capa */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-text">
                  Arquivo de capa (opcional)
                </p>

                <label
                  htmlFor="book-cover"
                  className="
    relative flex min-h-32 cursor-pointer flex-col
    items-center justify-center overflow-hidden
    rounded-xl border border-dashed border-primary/40
    bg-background/40 px-6 text-center
    transition-colors hover:border-primary
    hover:bg-background/70
  "
                >
                  <span className="font-medium text-primary">
                    Selecionar capa
                  </span>

                  <span className="mt-1 max-w-full truncate text-xs text-text-muted">
                    {removeCover ? "Capa será removida" : cover ? cover.name : book ? "Manter capa atual" : "PNG, JPG ou WebP"}
                  </span>

                  <input
                    id="book-cover"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(event) => {
                      setCover(event.target.files?.[0] ?? null);
                      setRemoveCover(false);
                    }}
                  />
                </label>
                {book && (
                  <label className="flex items-center gap-2 text-sm text-text-muted">
                    <input type="checkbox" checked={removeCover} onChange={(event) => setRemoveCover(event.target.checked)} />
                    Remover capa
                  </label>
                )}
              </div>
            </div>

            {book && pdf && (
              <p className="text-sm text-text-muted">Ao substituir o PDF, confira a quantidade de páginas. Suas notas e marcadores serão preservados e continuarão associados aos números de página anteriores.</p>
            )}

            <div className="flex flex-col items-center gap-4 rounded-xl border border-text/10 bg-background/30 p-4 sm:flex-row">
            <img src={booksCorner} alt="" aria-hidden="true" className="pointer-events-none h-20 w-28 shrink-0 object-contain sm:h-24" />
            <p className="text-xs leading-relaxed text-text-muted">
              Seus arquivos ficam somente neste navegador. Eles não são enviados
              para servidores e podem ser perdidos se você limpar os dados do
              navegador.
            </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-text/10 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isSaving}
                onClick={() => navigate(book ? `/library/${book.id}` : "/library")}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : book ? "Salvar alterações" : "Adicionar à biblioteca"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
