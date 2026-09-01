import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import type { Book } from "../types/book";
import { saveBook } from "../services/libraryService";
import { useLibrary } from "../hooks/useLibrary";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState<Book["status"]>("planned");
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

    if (!pdf) {
      setError("Selecione o PDF do livro.");
      return;
    }

    try {
      setIsSaving(true);

      await saveBook({
        title,
        author,
        pages: pageCount,
        status,
        file: pdf,
        cover,
      });

      await reloadBooks();

      navigate("/library")

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
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
            Sua coleção
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold text-text">
            Adicionar livro
          </h1>

          <p className="mt-3 max-w-2xl text-text-muted">
            Cadastre um PDF para começar a leitura e acompanhar seu progresso.
          </p>
        </header>

        <Card className="mt-8 border border-text/10 p-6 shadow-xl sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                    {pdf ? pdf.name : "Arquivo no formato PDF"}
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
                    {cover ? cover.name : "PNG, JPG ou WebP"}
                  </span>

                  <input
                    id="book-cover"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(event) =>
                      setCover(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
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
                onClick={() => navigate("/library")}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Adicionar à biblioteca"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
