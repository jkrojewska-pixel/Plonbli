"use client";

type FarmMapSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export default function FarmMapSearch({
  value,
  onChange,
  onClear,
}: FarmMapSearchProps) {
  return (
    <div className="mb-6 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-[#dfead7]">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Szukaj miasta lub produktu, np. Kraków, jajka, mleko"
          className="w-full rounded-xl border border-[#dfead7] bg-[#fcfef9] px-4 py-3 text-sm text-[#314830] outline-none transition focus:border-[#4CAF50]"
        />

        {value.trim() !== "" && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-[#dfead7] bg-white px-4 py-3 text-sm font-semibold text-[#4F7A51] transition hover:bg-[#f6fbf2]"
          >
            Wyczyść
          </button>
        )}
      </div>

      <p className="mt-3 text-sm text-[#6a7768]">
        Wyszukuj po mieście, lokalizacji lub nazwie produktu.
      </p>
    </div>
  );
}