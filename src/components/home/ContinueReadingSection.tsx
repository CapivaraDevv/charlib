import ContinueReadingCard from "./ContinueReadingCard";
import StatsCard from "./StatsCard";

export default function ContinueReadingSection() {
  return (
    <section className="grid grid-cols-[2fr_1fr] gap-2">
      <ContinueReadingCard />

      <aside className="flex h-full flex-col gap-4 pt-10">
        <StatsCard title="Sequência" />
        <StatsCard title="Meta do mês" />
        <StatsCard title="Livros" />
      </aside>
    </section>
  );
}
