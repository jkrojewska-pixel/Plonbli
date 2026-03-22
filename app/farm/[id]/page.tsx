"use client";

import FavoriteFarmButton from "@/components/FavoriteFarmButton";
import { createThread } from "../../../lib/messages";
import { addToCart } from "../../../lib/cart";
import { use, useEffect, useMemo, useState } from "react";
import { farms } from "../../../data/farms";

type ProductUnit = "kg" | "szt" | "pęczek" | "l" | "opak";

type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  image?: string;
  unit?: ProductUnit;
  quantityAvailable?: number;
};

type Farm = {
  id: number;
  name: string;
  location: string;
  badge: string;
  description: string;
  image: string;
  coverImageUrl?: string;
  delivery: string;
  pickup: string;
  style: string;
  lat: number;
  lng: number;
  products: Product[];
};

type FarmPageProps = {
  params: Promise<{ id: string }>;
};

export default function FarmPage({ params }: FarmPageProps) {
  const { id } = use(params);

  const farm = useMemo<Farm | undefined>(() => {
    return farms.find((item) => item.id === Number(id)) as Farm | undefined;
  }, [id]);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!farm) {
      setProducts([]);
      return;
    }

    const savedProducts: Product[] = JSON.parse(
      localStorage.getItem("products") || "[]"
    );

    const mergedProducts = [...(farm.products ?? []), ...savedProducts];
    setProducts(mergedProducts);
  }, [farm]);

  function handleAsk(product: Product) {
    if (!farm) return;

    createThread({
      farmId: farm.id,
      productName: product.name,
      text: `Dzień dobry, czy produkt "${product.name}" jest nadal dostępny?`,
      sender: "client",
    });

    alert('Rozmowa została utworzona w sekcji "Moje wiadomości".');
  }

  const visibleProducts = products.filter((product) => {
    const hasName = product.name?.trim();
    const hasDescription = product.description?.trim();
    const hasPrice = product.price?.trim();
    const hasQuantity = (product.quantityAvailable ?? 0) > 0;

    return hasName && hasDescription && hasPrice && hasQuantity;
  });

  if (!farm) {
    return (
      <div className="min-h-screen bg-[#F1F8E9] px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#dfead7]">
            <h1 className="text-2xl font-extrabold text-[#2E7D32]">
              Nie znaleziono gospodarstwa
            </h1>

            <p className="mt-3 text-[#667563]">
              To gospodarstwo nie istnieje albo zostało usunięte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F8E9] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[#dfead7]">
          <img
            src={farm.coverImageUrl || farm.image}
            alt={farm.name}
            className="h-[280px] w-full object-cover"
          />

          <div className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full bg-[#E6F2DE] px-4 py-2 text-sm font-semibold text-[#4F7A51]">
                  {farm.badge}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h1 className="text-4xl font-extrabold text-[#2E7D32]">
                    {farm.name}
                  </h1>

                  <FavoriteFarmButton farmId={String(farm.id)} />
                </div>

                <p className="mt-2 text-lg font-medium text-[#5f735e]">
                  📍 {farm.location}
                </p>

                <p className="mt-5 max-w-2xl leading-7 text-[#667563]">
                  {farm.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
                <div className="rounded-2xl bg-[#F7FBF2] p-4 ring-1 ring-[#e3eddc]">
                  <div className="text-sm font-semibold text-[#6a7868]">
                    Odbiór
                  </div>
                  <div className="mt-1 font-bold text-[#2E7D32]">
                    {farm.pickup}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F7FBF2] p-4 ring-1 ring-[#e3eddc]">
                  <div className="text-sm font-semibold text-[#6a7868]">
                    Dostawa
                  </div>
                  <div className="mt-1 font-bold text-[#2E7D32]">
                    {farm.delivery}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F7FBF2] p-4 ring-1 ring-[#e3eddc]">
                  <div className="text-sm font-semibold text-[#6a7868]">
                    Styl uprawy
                  </div>
                  <div className="mt-1 font-bold text-[#2E7D32]">
                    {farm.style}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#dfead7]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#2E7D32]">
                Produkty gospodarstwa
              </h2>
              <div className="rounded-full bg-[#EDF7E8] px-4 py-2 text-sm font-bold text-[#2E7D32]">
                {visibleProducts.length} produktów
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {visibleProducts.map((product, index) => (
                <div
                  key={`${farm.id}-${product.id}-${index}`}
                  className="overflow-hidden rounded-2xl border border-[#e1ebda] bg-[#fcfef9]"
                >
                  <div className="flex flex-col md:flex-row">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-56 w-full object-cover md:h-auto md:w-56"
                      />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-[#f3f7ef] text-sm font-medium text-[#8a9787] md:w-56">
                        Brak zdjęcia
                      </div>
                    )}

                    <div className="flex-1 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#314830]">
                            {product.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#6a7768]">
                            {product.description}
                          </p>

                          <p className="mt-3 text-sm font-semibold text-[#2E7D32]">
                            Dostępne: {product.quantityAvailable ?? 0}{" "}
                            {product.unit ?? "szt"}
                          </p>

                          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <button
                              onClick={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  farmId: farm.id,
                                })
                              }
                              className="rounded-xl bg-[#4CAF50] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#449d48]"
                            >
                              Dodaj do koszyka
                            </button>

                            <button
                              onClick={() => handleAsk(product)}
                              className="rounded-xl border border-green-300 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                            >
                              Zapytaj o produkt
                            </button>
                          </div>
                        </div>

                        <div className="whitespace-nowrap rounded-full bg-[#EDF7E8] px-4 py-2 text-sm font-bold text-[#2E7D32]">
                          {product.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {visibleProducts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#d9e6d0] bg-[#fafdf7] p-8 text-[#6a7768]">
                  To gospodarstwo nie ma jeszcze dodanych poprawnych produktów.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}