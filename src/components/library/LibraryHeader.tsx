import bookshelf from "../../assets/decorations/bookshelf.png";

export default function LibraryHeader() {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-text/10 pb-6 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
      <img
        src={bookshelf}
        alt=""
        aria-hidden="true"
        className="pointer-events-none order-last h-24 w-40 shrink-0 self-end object-contain sm:h-32 sm:w-48"
      />

      <div className="min-w-0">

        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Biblioteca
        </h1>

        <p className="mt-2 max-w-md text-sm text-text-muted sm:text-base">
          Toque ou passe o mouse sobre um livro para retirá-lo da estante.
        </p>
      </div>
    </header>
  );
}
