"use client";

import { useState, type FormEvent } from "react";
import type { FarmProfileFormValues } from "../../types/index";

interface EditFarmProfileFormProps {
  initialValues: FarmProfileFormValues;
  onSave: (values: FarmProfileFormValues) => void;
}

export function EditFarmProfileForm({
  initialValues,
  onSave,
}: EditFarmProfileFormProps) {
  const [form, setForm] = useState<FarmProfileFormValues>(initialValues);

  function updateField<K extends keyof FarmProfileFormValues>(
    key: K,
    value: FarmProfileFormValues[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      coverImageUrl: form.coverImageUrl.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Edytuj profil gospodarstwa</h2>

      <input
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="Nazwa gospodarstwa"
        className="w-full rounded-xl border px-3 py-2"
      />

      <textarea
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="Krótki opis gospodarstwa"
        rows={4}
        className="w-full rounded-xl border px-3 py-2"
      />

      <input
        value={form.location}
        onChange={(e) => updateField("location", e.target.value)}
        placeholder="Lokalizacja"
        className="w-full rounded-xl border px-3 py-2"
      />

      <input
        value={form.coverImageUrl}
        onChange={(e) => updateField("coverImageUrl", e.target.value)}
        placeholder="Link do zdjęcia w tle"
        className="w-full rounded-xl border px-3 py-2"
      />

      <button
        type="submit"
        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Zapisz zmiany
      </button>
    </form>
  );
}