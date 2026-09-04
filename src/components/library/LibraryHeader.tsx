import bookshelf from "../../assets/decorations/bookshelf.png";

export default function LibraryHeader() {
  return (
    <header className="relative mb-8 overflow-hidden border-b border-text/10 pb-8 sm:mb-10 sm:pb-10 lg:pr-72">
      <img
        src={bookshelf}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-2 z-0 hidden h-28 w-auto opacity-75 lg:block"
      />

      <div className="relative z-10">

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
