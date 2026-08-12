export default function LibraryHeader() {
  return (
    <header className="mb-8 sm:mb-10">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
        Sua coleção
      </p>

      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
        Biblioteca
      </h1>

      <p className="mt-2 max-w-md text-sm text-text-muted sm:text-base">
        Toque ou passe o mouse sobre um livro para retirá-lo da estante.
      </p>

      {/* <div className="mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-text/10" />
        <span className="text-[10px] uppercase tracking-[0.28em] text-text-muted/70">
          estante
        </span>
        <div className="h-px flex-1 bg-text/10" />
      </div> */}
    </header>
  );
}
