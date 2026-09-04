import ContinueReadingSection from "../components/home/ContinueReadingSection";
import ReadingDays from "../components/home/ReadingDays";
import RecentBooks from "../components/home/RecentBooks";
import DashboardLayout from "../layouts/DashboardLayout";
import { useLibrary } from "../hooks/useLibrary";
import openBookBookmark from "../assets/decorations/open-book-bookmark.png";

export default function Home() {
  const { books, isLoading, error } = useLibrary();

  return (
    <DashboardLayout>
      <header className="relative overflow-hidden border-b border-text/10 pb-8 pt-2 sm:pb-10 lg:pr-56">
        <img
          src={openBookBookmark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-3 z-0 hidden h-36 w-auto opacity-75 lg:block"
        />

        <div className="relative z-10 max-w-2xl">

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Seu próximo capítulo começa aqui.
          </h1>

          <p className="mt-3 max-w-xl text-text-muted">
            Retome sua leitura, acompanhe o ritmo e descubra o que a sua
            biblioteca tem para contar.
          </p>
        </div>
      </header>

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
