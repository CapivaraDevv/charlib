import Card from "../common/Card";
import Book from "/books/download.jpg";

export default function ContinueReadingCard() {
  return (
    <Card classname="mt-10 flex flex-col p-8">
      <h2 className="mb-6 font-display text-2xl font-bold">Continue lendo...</h2>

      <div className="flex gap-10">
        <img src={Book} alt="A Metamorfose" className="w-44 rounded-xl shadow-xl" />

        <div className="flex flex-1 flex-col">
          <h3 className="font-display text-3xl font-bold lg:text-4xl">A metamorfose</h3>

          <p className="mt-3 text-2xl text-white/80">Franz Kafka</p>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-lg text-white/90">
            <span>⭐ 4.3 / 5</span>
            <span>120 / 200 páginas</span>
            <span>4 notas</span>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm">
              <span>Progresso</span>
              <span>60%</span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-[#765242]">
              <div className="h-full w-[60%] rounded-full bg-[#E9C46A]" />
            </div>
          </div>

          <p className="mt-2 text-white/70">Última leitura hoje às 20:15</p>

          <button className="mt-auto self-end rounded-xl bg-[#8A5A44] px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-[#A66B50]">
            Continuar leitura →
          </button>
        </div>
      </div>
    </Card>
  );
}
