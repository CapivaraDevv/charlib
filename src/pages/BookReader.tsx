import { useParams, useNavigate } from "react-router-dom";
import { books } from "../data/books";
import ReaderHeader from "../components/reader/ReaderHeader";
import ReaderFooter from "../components/reader/ReaderFooter";
import PdfViewer from "../components/reader/PDFViewer";

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = books.find((book) => book.id === Number(id));

  if (!book) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Livro não encontrado</h1>

          <button
            onClick={() => navigate("/library")}
            className="rounded-lg bg-primary px-6 py-3"
          >
            Voltar para biblioteca
          </button>
        </div>
      </div>
    );
  }

  if (!book.file) {
    return (
      <div>
        <ReaderHeader book={book} />

        <div className="flex h-[70vh] items-center justify-center">
          <p>Este livro ainda não possui um arquivo para leitura.</p>
        </div>
      </div>
    );
  }

  const progress = Math.round((book.currentPage / book.pages) * 100);

  return (
    <main className="min-h-screen bg-background text-white">
      {/* Header */}

      <ReaderHeader book={book} />

      {/* Informações */}

      <section className="flex gap-10 p-10">
        <img src={book.image} alt={book.title} className="w-52 rounded-lg" />

        <div>
          <h1 className="text-5xl font-bold">{book.title}</h1>

          <p className="mt-3 text-xl text-gray-400">{book.author}</p>

          <div className="mt-8">
            <p className="mb-2">Progresso</p>

            <div className="h-3 w-96 rounded-full bg-[#3E281D]">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="mt-2">
              {book.currentPage} / {book.pages} páginas
            </p>
          </div>
        </div>
      </section>

      {/* Área de leitura */}

      <PdfViewer file={book.file} />

      <ReaderFooter book={book} />
    </main>
  );
}
