import Card from "../../ui/Card/index"
import Book from "/books/download.jpg"

export default function ContinueReadingCard() {
  return (
    <Card classname="p-8 m-auto mt-10 ">
      <h2 className="text-3xl font-bold mb-6">Continue lendo...</h2>

      <div className="flex gap-8">
        <img
          src={Book}
          alt="A Metamorfose"
          className="w-44 rounded-lg"
        />

        <div className="flex flex-col flex-1">
          <h3 className="text-2xl md:text-3xl font-bold">A metamorfose</h3>

          <p className="text-2xl mt-2">Franz Kafka</p>

          <div className="mt-4 space-y-3">
            <p>⭐ 4.3 / 5</p>

            <p>120 / 200 páginas</p>

            <p>4 notas</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
