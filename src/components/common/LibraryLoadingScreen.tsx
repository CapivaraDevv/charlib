import mouseReadingStack from "../../assets/mascot/mouse-reading-stack.png";
import Button from "./Button";

type Props = {
  message?: string;
  error?: string;
  isSigningOut?: boolean;
  onRetry?: () => void;
  onSignOut?: () => void;
};

export default function LibraryLoadingScreen({
  message = "Preparando sua biblioteca…",
  error,
  isSigningOut = false,
  onRetry,
  onSignOut,
}: Props) {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 py-12 text-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(232,185,87,0.07),transparent_65%)]"
      />

      <div className="flex w-full max-w-md flex-col items-center text-center">
        <img
          src={mouseReadingStack}
          alt=""
          aria-hidden="true"
          className="pointer-events-none mb-6 h-36 w-36 object-contain sm:h-44 sm:w-44"
        />

        <div role={error ? "alert" : "status"} aria-atomic="true">
          <h1 className="text-balance font-display text-2xl font-semibold leading-snug sm:text-3xl">
            {error || message}
          </h1>
        </div>

        {error ? (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={onRetry} disabled={isSigningOut}>
              Tentar novamente
            </Button>
            <Button type="button" variant="outline" onClick={onSignOut} disabled={isSigningOut}>
              {isSigningOut ? "Saindo…" : "Sair"}
            </Button>
          </div>
        ) : (
          <div aria-hidden="true" className="mt-6 flex h-12 items-center gap-2.5">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="library-loading-dot h-2 w-2 rounded-full bg-primary"
                style={{ animationDelay: `${index * 180}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
