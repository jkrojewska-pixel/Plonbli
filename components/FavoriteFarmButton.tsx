"use client";

import { useEffect, useState } from "react";
import { isFarmFavorite, toggleFavoriteFarm } from "@/lib/store";

type Props = {
  farmId: string;
};

export default function FavoriteFarmButton({ farmId }: Props) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFarmFavorite(farmId));
  }, [farmId]);

  const handleToggle = () => {
    toggleFavoriteFarm(farmId);
    setFavorite(isFarmFavorite(farmId));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      title={favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:scale-105 ${
        favorite
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-[#dfead7] bg-white text-[#6b7a67]"
      }`}
    >
      <span className="text-xl leading-none">{favorite ? "♥" : "♡"}</span>
    </button>
  );
}