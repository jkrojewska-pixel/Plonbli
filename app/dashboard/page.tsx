"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ProductUnit = "kg" | "szt" | "pęczek" | "l" | "opak";

type FarmerProduct = {
  id: number;
  name: string;
  price: string;
  status: string;
  quantity?: string;
  quantityAvailable?: number;
  unit?: ProductUnit;
  description?: string;
  image?: string;
};

const defaultProducts: FarmerProduct[] = [
  {
    id: 1,
    name: "Jajka wiejskie",
    price: "12 zł / 10 szt.",
    status: "Dostępne",
    quantity: "24 opak",
    quantityAvailable: 24,
    unit: "opak",
    description: "Świeże jajka od kur z wolnego wybiegu.",
  },
  {
    id: 2,
    name: "Pomidory malinowe",
    price: "14 zł / kg",
    status: "Dostępne",
    quantity: "18 kg",
    quantityAvailable: 18,
    unit: "kg",
    description: "Soczyste pomidory malinowe z lokalnej uprawy.",
  },
  {
    id: 3,
    name: "Miód wielokwiatowy",
    price: "35 zł / słoik",
    status: "Końcówka",
    quantity: "6 szt",
    quantityAvailable: 6,
    unit: "szt",
    description: "Naturalny miód wielokwiatowy z rodzinnej pasieki.",
  },
];

const inquiries = [
  {
    id: 1,
    product: "Jajka wiejskie",
    client: "Anna z Gdańska",
    message: "Czy mogę odebrać jutro po południu?",
  },
  {
    id: 2,
    product: "Miód wielokwiatowy",
    client: "Marek z Sopotu",
    message: "Czy jest dostępna dostawa w piątek?",
  },
];

function normalizeProduct(product: Partial<FarmerProduct>, index: number): FarmerProduct {
  const quantityAvailable =
    typeof product.quantityAvailable === "number"
      ? product.quantityAvailable
      : Number(product.quantity || 0);

  const unit = product.unit || "szt";

  const quantity =
    product.quantity && product.quantity.trim().length > 0
      ? product.quantity
      : `${Number.isFinite(quantityAvailable) ? quantityAvailable : 0} ${unit}`;

  return {
    id: typeof product.id === "number" ? product.id : Date.now() + index,
    name: product.name?.trim() || "",
    price: product.price?.trim() || "",
    status: product.status?.trim() || "Dostępne",
    quantity,
    quantityAvailable: Number.isFinite(quantityAvailable) ? quantityAvailable : 0,
    unit,
    description: product.description?.trim() || "",
    image: product.image?.trim() || "",
  };
}

export default function DashboardPage() {
  const [farmerProducts, setFarmerProducts] =
    useState<FarmerProduct[]>(defaultProducts);

  useEffect(() => {
    const savedProducts = localStorage.getItem("farmerProducts");

    if (!savedProducts) return;

    try {
      const parsedProducts = JSON.parse(savedProducts);

      if (!Array.isArray(parsedProducts)) return;

      const formattedProducts = parsedProducts.map(
        (product: Partial<FarmerProduct>, index: number) =>
          normalizeProduct(product, index)
      );

      setFarmerProducts(formattedProducts);
    } catch (error) {
      console.error("Nie udało się odczytać produktów rolnika z localStorage.", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("farmerProducts", JSON.stringify(farmerProducts));
  }, [farmerProducts]);

  const validProductsCount = useMemo(() => {
    return farmerProducts.filter((product) => {
      const hasName = product.name.trim().length > 0;
      const hasPrice = product.price.trim().length > 0;
      const hasDescription = (product.description || "").trim().length > 0;
      const hasQuantity = (product.quantityAvailable ?? 0) > 0;

      return hasName && hasPrice && hasDescription && hasQuantity;
    }).length;
  }, [farmerProducts]);

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = farmerProducts.filter((product) => product.id !== id);
    setFarmerProducts(updatedProducts);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-stone-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">Panel rolnika</p>
            <h1 className="mt-2 text-4xl font-bold text-stone-900">
              Witaj w Plonbli
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Zarządzaj swoimi produktami, sprawdzaj zapytania od klientów i
              rozwijaj sprzedaż lokalną bez pośredników.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/add-product"
              className="rounded-2xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Dodaj produkt
            </Link>

            <Link
              href="/farm/1"
              className="rounded-2xl border border-green-200 bg-white px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              Zobacz profil gospodarstwa
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Moje produkty</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">
              {farmerProducts.length}
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Poprawne produkty</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">
              {validProductsCount}
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Nowe zapytania</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">2</p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Status konta</p>
            <p className="mt-2 text-lg font-bold text-green-700">Aktywne</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">
                Moje produkty
              </h2>

              <Link
                href="/dashboard/add-product"
                className="text-sm font-medium text-green-700 hover:underline"
              >
                Dodaj nowy
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {farmerProducts.map((product, index) => {
                const isIncomplete =
                  !product.name.trim() ||
                  !product.price.trim() ||
                  !(product.description || "").trim() ||
                  (product.quantityAvailable ?? 0) <= 0;

                return (
                  <div
                    key={`${product.id}-${product.name}-${index}`}
                    className="flex flex-col gap-3 rounded-2xl border border-stone-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-stone-100">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || "Produkt"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-stone-400">
                            Brak zdjęcia
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-stone-900">
                          {product.name || "Produkt bez nazwy"}
                        </h3>

                        <p className="text-sm text-stone-500">
                          {product.price || "Brak ceny"}
                        </p>

                        {!!product.description && (
                          <p className="mt-1 text-xs text-stone-500">
                            {product.description}
                          </p>
                        )}

                        {(product.quantity || product.quantityAvailable !== undefined) && (
                          <p className="mt-1 text-xs text-stone-500">
                            Ilość:{" "}
                            {product.quantity ||
                              `${product.quantityAvailable ?? 0} ${product.unit ?? "szt"}`}
                          </p>
                        )}

                        {isIncomplete && (
                          <p className="mt-2 text-xs font-medium text-red-600">
                            Ten produkt jest niepełny i warto go usunąć albo poprawić.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {product.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <button className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                          Edytuj
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {farmerProducts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-stone-200 p-6 text-sm text-stone-500">
                  Nie masz jeszcze żadnych produktów. Dodaj pierwszy produkt, żeby
                  pojawił się tutaj i na profilu gospodarstwa.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-stone-900">
              Ostatnie zapytania
            </h2>

            <div className="mt-6 space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-2xl border border-stone-200 p-4"
                >
                  <p className="text-sm font-semibold text-green-700">
                    {inquiry.product}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {inquiry.client}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone-700">
                    {inquiry.message}
                  </p>

                  <button className="mt-4 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800">
                    Odpowiedz
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}