import ContinueReadingSection from "../components/home/ContinueReadingSection";
import ReadingDays from "../components/home/ReadingDays";
import RecentBooks from "../components/home/RecentBooks";
import DashboardLayout from "../layouts/DashboardLayout";
import { useLibrary } from "../hooks/useLibrary";

export default function Home() {
  const { books, isLoading, error } = useLibrary();

  return (
    <DashboardLayout>
      {error && (
        <p role="alert" className="mb-6 text-red-300">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="py-12 text-center text-text-muted">
          Carregando biblioteca...
        </p>
      ) : (
        <>
          <ContinueReadingSection books={books} />
          <ReadingDays />
          <RecentBooks books={books} />
        </>
      )}
    </DashboardLayout>
  );
}
