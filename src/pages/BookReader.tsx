import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { books } from "../data/books";
import ReaderHeader from "../components/reader/ReaderHeader";
import PdfViewer from "../components/reader/PdfViewer";

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem(`book-progress-${id}`);

    return saved ? Number(saved) : 1;
  });
  const [readingMode, setReadingMode] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const book = books.find((book) => book.id === Number(id));

  useEffect(() => {
    if (!book) return;

    localStorage.setItem(`book-progress-${book.id}`, String(currentPage));
  }, [currentPage, book]);

  useEffect(() => {
    if (!readingMode) {
      setShowControls(true);
      return;
    }

    let timer: number;

    function handleMouseMove() {
      setShowControls(true);

      clearTimeout(timer);

      timer = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [readingMode]);

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

  const progress = Math.round((currentPage / book.pages) * 100);

  return (
    <main
      className={`min-h-screen bg-background text-white ${
        readingMode ? "flex flex-col items-center justify-center" : ""
      }`}
    >
      {/* Header */}

      {!readingMode && <ReaderHeader book={book} />}

      <button
        onClick={() => setReadingMode((prev) => !prev)}
        className={`fixed right-6 top-6 z-50 rounded-lg bg-primary px-4 py-2 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {readingMode ? "Sair da leitura" : "Modo leitura"}
      </button>
      {/* Informações */}
      {!readingMode && (
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
                {currentPage} / {book.pages} páginas
              </p>
            </div>
          </div>
        </section>
      )}
      {/* Área de leitura */}

      <div className={readingMode ? "w-full flex justify-center" : ""}>
        <PdfViewer
          file={book.file}
          page={currentPage}
          setPage={setCurrentPage}
        />
      </div>
    </main>
  );
}
