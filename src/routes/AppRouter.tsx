import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Library from "../pages/Library";
import BookReader from "../pages/BookReader";
import Goals from "../pages/Goals";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:id" element={<BookReader />} />
        <Route path="/objetivos" element={<Goals />} />
      </Routes>
    </BrowserRouter>
  );
}