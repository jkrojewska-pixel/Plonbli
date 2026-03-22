import Link from "next/link";

export default function FarmersPage() {
  return (
    <main className="min-h-screen bg-green-50">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-bold text-stone-900">
          Sprzedawaj swoje produkty lokalnie
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-700">
          Plonbli pozwala rolnikom sprzedawać produkty bez pośredników.
          Dodaj swoje gospodarstwo, wystaw produkty i rozmawiaj bezpośrednio
          z klientami z Twojej okolicy.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            href="/dashboard/add-product"
            className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-stone-900 group-hover:text-green-700">
              Dodawaj produkty
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Dodaj zdjęcia, opis i dostępność swoich produktów.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-green-700">
              Przejdź do formularza →
            </span>
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Rozmawiaj z klientami
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Odpowiadaj na pytania i ustal szczegóły odbioru lub dostawy.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Sprzedawaj lokalnie
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Docieraj do klientów w swojej okolicy bez pośredników.
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="mt-10 inline-flex rounded-2xl bg-green-700 px-8 py-4 font-semibold text-white transition hover:bg-green-800"
        >
          Załóż konto rolnika
        </Link>
      </section>
    </main>
  );
}