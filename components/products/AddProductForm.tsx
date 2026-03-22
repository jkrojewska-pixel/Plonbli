"use client";

import { useState } from "react";
import {
  Product,
  ProductFormValues,
  ProductUnit,
  emptyProductForm,
} from "@/types";

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
}

export function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>({
    ...emptyProductForm,
    unit: "kg",
  });

  function updateField<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      price: Number(form.price),
      unit: "kg",
      quantityAvailable: Number(form.quantityAvailable),
      imageUrl: form.imageUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddProduct(newProduct);

    setForm({
      ...emptyProductForm,
      unit: "kg",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Dodaj produkt</h2>

      <input
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="Nazwa produktu"
        className="w-full rounded-xl border px-3 py-2"
      />

      <input
        value={form.price}
        onChange={(e) => updateField("price", e.target.value)}
        placeholder="Cena za kg (zł)"
        type="number"
        min="0"
        step="0.01"
        className="w-full rounded-xl border px-3 py-2"
      />

      <select
        value="kg"
        onChange={(e) => updateField("unit", e.target.value as ProductUnit)}
        className="w-full rounded-xl border px-3 py-2 bg-gray-50 text-gray-500"
        disabled
      >
        <option value="kg">kg</option>
      </select>

      <input
        value={form.quantityAvailable}
        onChange={(e) => updateField("quantityAvailable", e.target.value)}
        placeholder="Dostępna ilość (kg)"
        type="number"
        min="0"
        step="0.01"
        className="w-full rounded-xl border px-3 py-2"
      />

      <input
        value={form.imageUrl}
        onChange={(e) => updateField("imageUrl", e.target.value)}
        placeholder="Link do zdjęcia produktu"
        className="w-full rounded-xl border px-3 py-2"
      />

      <button
        type="submit"
        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Dodaj produkt
      </button>
    </form>
  );
}