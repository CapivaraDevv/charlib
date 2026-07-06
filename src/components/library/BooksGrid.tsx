import type { Book } from "../../types/book";
import BookCard from "../common/BookCard";
import { useNavigate } from "react-router-dom";

interface BooksGridProps {
  books: Book[];
}

export default function BooksGrid({ books }: BooksGridProps) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5">
      {books.map((book) => (
        <div
          key={book.id}
          onClick={() => navigate(`/library/${book.id}`)}
          className="cursor-pointer"
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
