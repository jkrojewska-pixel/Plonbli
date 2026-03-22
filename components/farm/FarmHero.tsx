import { Farm } from "@/types";

interface FarmHeroProps {
  farm: Farm;
}

export function FarmHero({ farm }: FarmHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="relative h-64 w-full bg-gray-200">
        {farm.coverImageUrl ? (
          <img
            src={farm.coverImageUrl}
            alt={farm.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Dodaj zdjęcie gospodarstwa
          </div>
        )}
      </div>

      <div className="space-y-3 p-6">
        <div>
          <h1 className="text-2xl font-bold">{farm.name}</h1>
          <p className="mt-1 text-sm text-gray-600">📍 {farm.location}</p>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-gray-700">
          {farm.description}
        </p>
      </div>
    </section>
  );
}