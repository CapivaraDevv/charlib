import type { Book } from "../../types/book";
import BookCard from "../common/BookCard";
import Card from "../common/Card";

type RecentBooksProps = {
  books: Book[];
};

export default function RecentBooks({ books }: RecentBooksProps) {
  return (
    <Card className="mt-8 p-8">
      <div className="mb-6 flex items-center justify-between px-4">
        <h2 className="font-display text-2xl font-bold">
          Adicionados recentemente
        </h2>

        <button className="text-surface font-bold transition bg-primary rounded-2xl p-2 cursor-pointer hover:">
          Ver todos
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        {books.slice(0, 4).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </Card>
  );
}
