import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import DashboardLayout from "../layouts/DashboardLayout";
import LibraryHeader from "../components/library/LibraryHeader";
import SearchBar from "../components/library/SearchBar";
import FilterTabs from "../components/library/FilterTabs";
import Bookshelf from "../components/library/Bookshelf";
import LibraryToolbar from "../components/library/LibraryToolbar";
import { books } from "../data/books";
import type { Book } from "../types/book";

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter") ?? "Todos";
  const initialSearch = searchParams.get("search") ?? "";

  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const [sortBy, setSortBy] = useState("progress");

  useEffect(() => {
    const params: Record<string, string> = {};

    if (selectedFilter !== "Todos") {
      params.filter = selectedFilter;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    setSearchParams(params);
  }, [selectedFilter, debouncedSearch, setSearchParams]);

  const filteredBooks = useMemo(() => {
    const filterMap: Record<string, Book["status"] | "all"> = {
      Todos: "all",
      Lendo: "reading",
      Concluídos: "completed",
      Planejados: "planned",
    };

    const filtered = books
      .filter((book) => {
        const filter = filterMap[selectedFilter];
        if (filter === "all") return true;
        return book.status === filter;
      })
      .filter((book) => {
        if (!debouncedSearch) return true;
        return book.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return b.currentPage / b.pages - a.currentPage / a.pages;

        case "rating":
          return b.rating - a.rating;

        case "title":
          return a.title.localeCompare(b.title);

        default:
          return 0;
      }
    });
  }, [selectedFilter, debouncedSearch, sortBy]);

  const hasActiveFilters =
    selectedFilter !== "Todos" || debouncedSearch.length > 0;

  return (
    <DashboardLayout>
      <LibraryHeader />

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <FilterTabs
        selectedFilter={selectedFilter}
        onChange={setSelectedFilter}
      />

      <LibraryToolbar
        bookCount={filteredBooks.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Bookshelf
        books={filteredBooks}
        hasActiveFilters={hasActiveFilters}
      />
    </DashboardLayout>
  );
}
