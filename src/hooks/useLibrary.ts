import { createContext, useContext } from "react";
import type { Book } from "../types/book";

export type LibraryContextValue = {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  reloadBooks: () => Promise<void>;
};

export const LibraryContext =
  createContext<LibraryContextValue | null>(null);

export function useLibrary(): LibraryContextValue {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error(
      "useLibrary deve ser usado dentro de LibraryProvider.",
    );
  }

  return context;
}