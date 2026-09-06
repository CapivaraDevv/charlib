import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LibraryContext } from "../hooks/useLibrary";
import Logo from "../assets/Logo.png";
import { books as initialBooks } from "../data/books";
import {
  deleteStoredBook,
  getStoredBooks,
  type StoredBook,
} from "../services/libraryService";
import type { Book } from "../types/book";
import { removeNotesForBook } from "../services/notes";
import { removeBookMarksForBook } from "../services/bookmarks";
import { accountStorage, storageAccount } from "../services/accountStorage";
import { getCloudBooks } from "../services/cloudLibrary";

function convertStoredBook(storedBook: StoredBook, objectUrls: string[]): Book {
  const fileUrl = URL.createObjectURL(storedBook.file);
  objectUrls.push(fileUrl);

  let coverUrl = Logo;

  if (storedBook.cover) {
    coverUrl = URL.createObjectURL(storedBook.cover);
    objectUrls.push(coverUrl);
  }

  return {
    id: storedBook.id,
    title: storedBook.title,
    author: storedBook.author,
    pages: storedBook.pages,
    currentPage: storedBook.currentPage,
    rating: storedBook.rating,
    notes: storedBook.notes,
    status: storedBook.status,
    file: fileUrl,
    image: coverUrl,
    isUserAdded: true,
    createdAt: storedBook.createdAt,
  };
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const objectUrlsRef = useRef<string[]>([]);

  const reloadBooks = useCallback(async () => {
    try {
      const user = storageAccount();
      const storedBooks = user ? [] : await getStoredBooks();
      const newObjectUrls: string[] = [];

      const convertedBooks = user ? await getCloudBooks() : storedBooks.map((book) =>
        convertStoredBook(book, newObjectUrls),
      );
      if (storageAccount() !== user) return;

      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));

      objectUrlsRef.current = newObjectUrls;

      setBooks([...initialBooks, ...convertedBooks]);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar a biblioteca.");
      throw cause;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeBook = useCallback(
    async (id: number) => {
      if (initialBooks.some((book) => book.id === id)) {
        throw new Error("Os livros iniciais não podem ser excluídos.");
      }

      await deleteStoredBook(id);

      let cleanupFailed = false;

      try {
        removeNotesForBook(id);
        removeBookMarksForBook(id);

        accountStorage.removeItem(`book-progress-${id}`);

        if (accountStorage.getItem("last-book") === String(id)) {
          accountStorage.removeItem("last-book");
        }
      } catch {
        cleanupFailed = true;
      }

      await reloadBooks();

      if (cleanupFailed) {
        setError(
          "O livro foi excluído, mas não foi possível limpar todos os dados de leitura associados.",
        );
      }
    },
    [reloadBooks],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reloadBooks().catch(() => {});
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);

      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [reloadBooks]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        isLoading,
        error,
        reloadBooks,
        removeBook,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
