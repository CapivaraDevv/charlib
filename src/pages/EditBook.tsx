import { Link, useParams } from "react-router-dom";
import { useLibrary } from "../hooks/useLibrary";
import DashboardLayout from "../layouts/DashboardLayout";
import AddBook from "./AddBook";

export default function EditBook() {
  const { id } = useParams();
  const { books, isLoading, error } = useLibrary();
  const book = books.find((item) => item.id === Number(id));
  if (isLoading || !book?.isUserAdded) {
    return (
      <DashboardLayout>
        <p>{isLoading ? "Carregando livro..." : error ?? "Livro não encontrado para edição."}</p>
        {!isLoading && <Link to="/library" className="mt-4 inline-block text-primary">Voltar para biblioteca</Link>}
      </DashboardLayout>
    );
  }
  return <AddBook key={book.id} book={book} />;
}
