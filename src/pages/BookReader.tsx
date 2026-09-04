import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLibrary } from "../hooks/useLibrary";
import ReaderHeader from "../components/reader/ReaderHeader";
import PdfViewer from "../components/reader/PdfViewer";
import ProgressBar from "../components/common/ProgressBar";
import ReaderToolbar from "../components/reader/ReaderToolbar";
import NoteModal from "../components/reader/NoteModal";
import { saveNote, getNotes, updateNote, deleteNote } from "../services/notes";
import type { Note } from "../types/note";
import NotesPanel from "../components/reader/NotesPanel";
import type { BookMark } from "../types/bookmark";
import {
  getBookMarks,
  removeBookMark,
  saveBookMark,
} from "../services/bookmarks";
import BookmarksPanel from "../components/reader/BookMarksPanel";
import { recordReadPage } from "../services/readingService";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import readingLamp from "../assets/decorations/reading-lamp.png";

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, isLoading, removeBook } = useLibrary();
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem(`book-progress-${id}`);

    return saved ? Number(saved) : 1;
  });
  const [readingMode, setReadingMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showBookMarks, setShowBookMarks] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [readingError, setReadingError] = useState<string | null>(null);

  const book = books.find((book) => book.id === Number(id));

  const [notes, setNotes] = useState<Note[]>(() =>
    book ? getNotes(book.id) : [],
  );

  const [bookMarks, setBookMarks] = useState<BookMark[]>(() =>
    book ? getBookMarks(book.id) : [],
  );

  useEffect(() => {
    if (!book) return;

    localStorage.setItem(`book-progress-${book.id}`, String(currentPage));
  }, [currentPage, book]);

  useEffect(() => {
    if (!book) return;

    localStorage.setItem("last-book", String(book.id));
  }, [book]);

  useEffect(() => {
    if (!readingMode) {
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

  function handleSaveNote(content: string) {
    if (!book) return;

    saveNote({
      id: crypto.randomUUID(),
      bookId: book.id,
      page: currentPage,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setNotes(getNotes(book.id));
  }

  function handleUpdateNote(content: string) {
    if (!book || !selectedNote) return;

    updateNote({
      ...selectedNote,
      content,
    });

    setNotes(getNotes(book.id));
    setSelectedNote(null);
  }

  function handleDeleteNote(note: Note) {
    if (!book) return;

    deleteNote(note.id, book.id);

    setNotes(getNotes(book.id));
  }

  function handleBookMark() {
    if (!book) return;

    const exists = bookMarks.find((bookmark) => bookmark.page === currentPage);

    if (exists) {
      removeBookMark(exists.id);
    } else {
      saveBookMark({
        id: crypto.randomUUID(),
        bookId: book.id,
        page: currentPage,
        createdAt: new Date().toISOString(),
      });
    }

    setBookMarks(getBookMarks(book.id));
  }

  function closeDeleteConfirm() {
    if (isDeleting) return;

    setShowDeleteConfirm(false);
    setDeleteError(null);
  }

  async function handleDeleteBook() {
    if (!book?.isUserAdded || isDeleting) return;

    setDeleteError(null);
    setIsDeleting(true);

    try {
      await removeBook(book.id);
      navigate("/library", { replace: true });
    } catch {
      setDeleteError("Não foi possível excluir o livro. Tente novamente");
    } finally {
      setIsDeleting(false);
    }
  }

  function handlePageRead(pageNumber: number): boolean {
    if (!book) return false;

    try {
      recordReadPage(book.id, pageNumber);
      setReadingError(null);
      return true;
    } catch {
      setReadingError(
        "Não foi possível registrar a leitura desta página. Tente novamente.",
      );
      return false;
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text">
        Carregando livro...
      </div>
    );
  }

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
        <ReaderHeader />

        <div className="flex h-[70vh] items-center justify-center">
          <p>Este livro ainda não possui um arquivo para leitura.</p>
        </div>
      </div>
    );
  }

  const isCurrentPageBookmarked = bookMarks.some(
    (bookmark) => bookmark.page === currentPage,
  );

  const progress = Math.round((currentPage / book.pages) * 100);

  return (
    <main
      className={`min-h-screen bg-background text-white ${
        readingMode ? "flex flex-col items-center justify-center" : ""
      }`}
    >
      {/* Header */}

      {!readingMode && (
        <ReaderHeader
          canDelete={book.isUserAdded === true}
          onDelete={() => {
            setDeleteError(null);
            setShowDeleteConfirm(true);
          }}
        />
      )}

      <Modal
        open={showDeleteConfirm}
        title="Excluir livro?"
        size="sm"
        onClose={closeDeleteConfirm}
      >
        <p className="text-text-muted">
          Deseja excluir “{book.title}” da biblioteca? O cadastro, o PDF, a
          capa, o progresso, as notas e os marcadores desse livro serão
          removidos do CharLib. Essa ação não pode ser desfeita. O arquivo
          original no computador não será apagado.
        </p>

        {deleteError && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {deleteError}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={closeDeleteConfirm}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={isDeleting}
            onClick={handleDeleteBook}
          >
            {isDeleting ? "Excluindo..." : "Excluir livro"}
          </Button>
        </div>
      </Modal>

      <ReaderToolbar
        readingMode={readingMode}
        showControls={showControls}
        notesOpen={showNotes}
        bookmarksOpen={showBookMarks}
        onToggleReadingMode={() => {
          setReadingMode((prev) => {
            const next = !prev;

            if (!next) {
              setShowControls(true);
            }

            return next;
          });
        }}
        onAddNote={() => setIsNoteModalOpen(true)}
        onToggleNotes={() => {
          setShowNotes((prev) => {
            const next = !prev;

            if (next) {
              setShowBookMarks(false);
            }

            return next;
          });
        }}
        onAddBookmark={handleBookMark}
        onToggleBookMarks={() => {
          setShowBookMarks((prev) => {
            const next = !prev;

            if (next) {
              setShowNotes(false);
            }

            return next;
          });
        }}
      />

      {/* Informações */}
      {!readingMode && (
        <section className="relative overflow-hidden p-4 sm:p-10">
          <img
            src={readingLamp}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-6 z-0 hidden h-48 w-auto opacity-25 xl:block"
          />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:gap-10">
            <img
              src={book.image}
              alt={book.title}
              className="mx-auto w-36 rounded-lg sm:mx-0 sm:w-52"
            />

            <div className="min-w-0 flex-1">
              <h1 className="break-words font-display text-3xl font-bold sm:text-5xl">
                {book.title}
              </h1>

              <p className="mt-3 text-lg text-text-muted sm:text-xl">
                {book.author}
              </p>

              <div className="mt-8">
                <p className="mb-2">Progresso</p>

                <ProgressBar value={progress} />

                <p className="mt-2">
                  {currentPage} / {book.pages} páginas
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Área de leitura */}

      <BookmarksPanel
        open={showBookMarks}
        bookmarks={bookMarks}
        onClose={() => setShowBookMarks(false)}
        onSelect={(page) => {
          setCurrentPage(page);
          setShowBookMarks(false);
        }}
      />

      <NoteModal
        key={selectedNote?.id ?? "new"}
        open={isNoteModalOpen}
        page={currentPage}
        note={selectedNote}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={selectedNote ? handleUpdateNote : handleSaveNote}
      />

      <NotesPanel
        open={showNotes}
        notes={notes}
        currentPage={currentPage}
        onClose={() => setShowNotes(false)}
        onSelect={(page) => {
          setCurrentPage(page);
          setShowNotes(false);
        }}
        onEdit={(note) => {
          setSelectedNote(note);
          setIsNoteModalOpen(true);
          setShowNotes(false);
        }}
        onDelete={handleDeleteNote}
      />

      {readingError && (
        <p role="alert" className="px-4 py-3 text-sm text-red-300 sm:px-10">
          {readingError}
        </p>
      )}

      <div className={readingMode ? "w-full flex justify-center" : ""}>
        <PdfViewer
          key={book.id}
          file={book.file}
          page={currentPage}
          setPage={setCurrentPage}
          bookmarked={isCurrentPageBookmarked}
          onPageRead={handlePageRead}
          navigationEnabled={!isNoteModalOpen && !showDeleteConfirm}
        />
      </div>
    </main>
  );
}
