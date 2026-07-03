interface Props {
  title: string;
}

export default function StatsCard({ title }: Props) {
  return (
    <div className="flex h-24 flex-1 items-center justify-center rounded-3xl bg-[#4A3225]">
      <h2 className="text-xl text-white">{title}</h2>
    </div>
  );
}
