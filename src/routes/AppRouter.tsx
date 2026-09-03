import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useLibrary } from "../hooks/useLibrary";

import Home from "../pages/Home";
import Library from "../pages/Library";
import BookReader from "../pages/BookReader";
import Goals from "../pages/Goals";
import AddBook from "../pages/AddBook";
import NotFound from "../pages/NotFound";

function BookReaderRoute() {
  const { id } = useParams();
  const { isLoading } = useLibrary();

  return <BookReader key={`${id ?? "unknown"}-${isLoading}`} />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:id" element={<BookReaderRoute />} />
        <Route path="/objetivos" element={<Goals />} />
        <Route path="/adicionar-livro" element={<AddBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
