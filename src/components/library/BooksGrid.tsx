import type { Book } from "../../types/book";
import Bookshelf from "./Bookshelf";

interface BooksGridProps {
  books: Book[];
}

export default function BooksGrid({ books }: BooksGridProps) {
  return <Bookshelf books={books} />;
}
