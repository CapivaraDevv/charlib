import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { books } from "../data/books";
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

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem(`book-progress-${id}`);

    return saved ? Number(saved) : 1;
  });
  const [readingMode, setReadingMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookMarks, setBookMarks] = useState<BookMark[]>([]);
  const [showBookMarks, setShowBookMarks] = useState(false);

  const isCurrentPageBookmarked = bookMarks.some(
    (bookmark) => bookmark.page === currentPage,
  );

  const book = books.find((book) => book.id === Number(id));

  useEffect(() => {
    if (!book) return;

    localStorage.setItem(`book-progress-${book.id}`, String(currentPage));
  }, [currentPage, book]);

  useEffect(() => {
    if (!book) return;

    localStorage.setItem("last-book", String(book.id));
  }, [book]);

  useEffect(() => {
    if (!book) return;

    setNotes(getNotes(book.id));
  }, [book]);

  useEffect(() => {
    if (!book) return;

    setBookMarks(getBookMarks(book.id));
  }, [book]);

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

  const progress = Math.round((currentPage / book.pages) * 100);

  return (
    <main
      className={`min-h-screen bg-background text-white ${
        readingMode ? "flex flex-col items-center justify-center" : ""
      }`}
    >
      {/* Header */}

      {!readingMode && <ReaderHeader />}

      <ReaderToolbar
        readingMode={readingMode}
        showControls={showControls}
        notesOpen={showNotes}
        bookmarksOpen={showBookMarks}
        onToggleReadingMode={() => setReadingMode((prev) => !prev)}
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
        <section className="flex gap-10 p-10">
          <img src={book.image} alt={book.title} className="w-52 rounded-lg" />

          <div>
            <h1 className="text-5xl font-bold">{book.title}</h1>

            <p className="mt-3 text-xl text-gray-400">{book.author}</p>

            <div className="mt-8">
              <p className="mb-2">Progresso</p>

              <ProgressBar value={progress} />

              <p className="mt-2">
                {currentPage} / {book.pages} páginas
              </p>
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

      <div className={readingMode ? "w-full flex justify-center" : ""}>
        <PdfViewer
          file={book.file}
          page={currentPage}
          setPage={setCurrentPage}
          bookmarked={isCurrentPageBookmarked}
        />
      </div>
    </main>
  );
}
