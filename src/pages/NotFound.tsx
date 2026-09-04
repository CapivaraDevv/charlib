import { Link } from "react-router-dom";
import mouseResting from "../assets/mascot/mouse-resting.png";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-text">
      <section className="max-w-md text-center">
        <img
          src={mouseResting}
          alt=""
          aria-hidden="true"
          className="pointer-events-none mx-auto mb-6 hidden h-40 w-auto md:block"
        />
        <div>
          <p className="font-display text-7xl font-bold text-primary sm:text-8xl">
            404
          </p>

          <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
            Página não encontrada
          </h1>

          <p className="mt-3 text-text-muted">
            O endereço que você acessou não existe ou foi movido.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-medium text-background transition-colors hover:bg-primary-hover"
          >
            Voltar para a Home
          </Link>
        </div>
      </section>
    </main>
  );
}
