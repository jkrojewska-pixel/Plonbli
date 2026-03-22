import Image from "next/image"
import Link from "next/link" 
import MapSection from "../components/MapSection"
import { farms } from "../data/farms"

const stats: [string, string][] = [
  ["120+", "lokalnych gospodarstw"],
  ["3 500+", "świeżych produktów"],
  ["100+", "zadowolonych Klientów"],
]

const steps: [string, string, string][] = [
  ["1", "Odkryj lokalnych producentów", "Przeglądaj mapę i znajdź gospodarstwa w swojej okolicy."],
  ["2", "Wybierz świeże produkty", "Porównuj oferty i kupuj dokładnie to, czego potrzebujesz."],
  ["3", "Zamów wygodnie", "Skorzystaj z odbioru osobistego albo dostawy do wybranego punktu."],
]

export default function PlonbliHomepage() {
  return (
    <div
      className="min-h-screen bg-[#F1F8E9] text-[#243126]"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >


      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="flex flex-col justify-start pt-6 lg:pt-10">
            <div className="mb-5 inline-flex w-fit items-center rounded-full bg-[#E6F2DE] px-4 py-2 text-sm font-semibold text-[#4F7A51] ring-1 ring-[#d8ead0]">
              Lokalna żywność od sprawdzonych gospodarstw
            </div>

            <h1
              className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#244126] md:text-6xl"
              style={{ fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif" }}
            >
              Kupuj świeże produkty bezpośrednio od rolników w swojej okolicy.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#5d6d5b]">
              Odkrywaj gospodarstwa, przeglądaj sezonowe produkty i zamawiaj wygodnie z odbiorem
              lub dostawą. Prosto, lokalnie i bez zbędnych pośredników.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#gospodarstwa"
                className="rounded-2xl bg-[#2E7D32] px-6 py-3 text-center font-bold text-white shadow-md transition hover:opacity-95"
              >
                Przeglądaj gospodarstwa
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#dfecd8]">
                  <div
                    className="text-2xl font-extrabold text-[#2E7D32]"
                    style={{ fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif" }}
                  >
                    {value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-[#71806f]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-[#dbe8d1] bg-white shadow-xl">
              <div className="border-b border-[#e4efdc] bg-[#F7FBF2] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div
                      className="text-xl font-extrabold text-[#2E7D32]"
                      style={{ fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif" }}
                    >
                      Gospodarstwa w pobliżu
                    </div>
                    <div className="text-sm font-medium text-[#6e7f6d]">Warszawa + 25 km</div>
                  </div>
                </div>
              </div>

              <div id="gospodarstwa" className="p-5">
                <MapSection />
              </div>

              <div className="space-y-4 p-5 pt-0">
                {farms.map((farm) => (
                  <div
                    key={farm.id}
                    className="grid gap-4 rounded-[1.5rem] border border-[#e4efdc] bg-[#fcfef9] p-4 shadow-sm md:grid-cols-[120px_1fr_auto]"
                  >
                    <img
                      src={farm.image}
                      alt={farm.name}
                      className="h-28 w-full rounded-2xl object-cover"
                    />

                    <div>
                      <div className="mb-1 inline-flex rounded-full bg-[#EDF7E8] px-3 py-1 text-xs font-bold text-[#4D7A4F]">
                        {farm.badge}
                      </div>
                      <h3 className="text-xl font-bold text-[#314830]">{farm.name}</h3>
                      <p className="mt-1 text-sm font-medium text-[#6c7b69]">{farm.description}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#F1F8E9] px-3 py-1 text-xs font-semibold text-[#60705f]">
                          {farm.location}
                        </span>
                        <span className="rounded-full bg-[#F1F8E9] px-3 py-1 text-xs font-semibold text-[#60705f]">
                          {farm.delivery}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-3">
                      <div className="text-sm font-bold text-[#2E7D32]">
                        {farm.products.length} produktów
                      </div>
                      <Link
                        href={`/farm/${farm.id}`}
                        className="rounded-2xl bg-[#4CAF50] px-4 py-2 text-sm font-bold text-white shadow-sm"
                      >
                        Zobacz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="jak-to-dziala" className="border-y border-[#dfebd7] bg-white/70">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="max-w-2xl">
              <h2
                className="text-3xl font-extrabold text-[#2C4A2E]"
                style={{ fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif" }}
              >
                Jak działa Plonbli?
              </h2>
              <p className="mt-3 text-[#6b7a68]">
                Wybierasz gospodarstwo, dodajesz produkty do koszyka i decydujesz, jak chcesz je
                odebrać. Wszystko w jednym, prostym miejscu.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map(([n, title, desc]) => (
                <div key={title} className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-[#e0ecd9]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4CAF50] font-bold text-white">
                    {n}
                  </div>
                  <h3 className="text-xl font-bold text-[#314830]">{title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-[#6f7d6d]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="o-plonbli" className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] bg-[#2E7D32] px-8 py-10 text-white shadow-xl md:flex md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2
                className="text-3xl font-extrabold"
                style={{ fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif" }}
              >
                Lokalny marketplace, który zbliża rolników i klientów.
              </h2>
              <p className="mt-3 text-white/85">
                Plonbli pomaga kupować świadomie, wspierać małe gospodarstwa i mieć lepszy dostęp
                do świeżej, lokalnej żywności.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}