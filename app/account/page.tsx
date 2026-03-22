"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { farms } from "../../data/farms"
import { getFavoriteFarmIds, store } from "@/lib/store"

type Order = {
  id: number
  createdAt: string
  items: {
    cartItemId: string
    farmId: number
    productId: number
    name: string
    price: string
    image?: string
  }[]
  total: number
  pickupMethod: "pickup" | "point"
  paymentMethod: "direct"
  status: "new"
}

type ClientProfile = {
  name: string
  city: string
  bio: string
}

const emptyClientProfile: ClientProfile = {
  name: "",
  city: "",
  bio: "",
}

export default function AccountPage() {
  const router = useRouter()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [profile, setProfile] = useState<ClientProfile>(emptyClientProfile)
  const [savedProfile, setSavedProfile] = useState<ClientProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const auth = store.getAuth()

    if (!auth.isLoggedIn || auth.role !== "client") {
      router.push("/login")
      return
    }

    const rawUser = localStorage.getItem("plonbli_user")
    const parsedUser = rawUser ? JSON.parse(rawUser) : null

    if (!parsedUser?.id) {
      router.push("/login")
      return
    }

    const userId = String(parsedUser.id)
    setCurrentUserId(userId)

    const rawDemoUser = localStorage.getItem("plonbliDemoUser")
    const demoUser = rawDemoUser ? JSON.parse(rawDemoUser) : null

    const profileKey = `plonbli_client_profile_${userId}`
    const storedProfile = localStorage.getItem(profileKey)

    if (storedProfile) {
      const parsedProfile: ClientProfile = JSON.parse(storedProfile)
      setProfile(parsedProfile)
      setSavedProfile(parsedProfile)
      setIsEditing(false)
    } else {
      const freshProfile: ClientProfile = {
        name: demoUser?.name || parsedUser.name || "",
        city: "",
        bio: "",
      }

      localStorage.setItem(profileKey, JSON.stringify(freshProfile))
      setProfile(freshProfile)
      setSavedProfile(null)
      setIsEditing(true)
    }

    setFavoriteIds(getFavoriteFarmIds())

    const savedOrders = JSON.parse(
      localStorage.getItem("plonbli_orders") || "[]"
    ) as Order[]

    setOrders(savedOrders)
  }, [router])

  const favoriteFarms = useMemo(() => {
    return farms.filter((farm) => favoriteIds.includes(String(farm.id)))
  }, [favoriteIds])

  function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!currentUserId) return
    if (!profile.name.trim()) {
      alert("Uzupełnij nazwę użytkownika.")
      return
    }

    const profileToSave: ClientProfile = {
      name: profile.name.trim(),
      city: profile.city.trim(),
      bio: profile.bio.trim(),
    }

    localStorage.setItem(
      `plonbli_client_profile_${currentUserId}`,
      JSON.stringify(profileToSave)
    )

    const rawDemoUser = localStorage.getItem("plonbliDemoUser")
    const demoUser = rawDemoUser ? JSON.parse(rawDemoUser) : {}

    localStorage.setItem(
      "plonbliDemoUser",
      JSON.stringify({
        ...demoUser,
        role: "client",
        id: currentUserId,
        name: profileToSave.name,
      })
    )

    setProfile(profileToSave)
    setSavedProfile(profileToSave)
    setIsEditing(false)
  }

  function handleCancelEditing() {
    if (savedProfile) {
      setProfile(savedProfile)
      setIsEditing(false)
      return
    }

    setProfile(emptyClientProfile)
    setIsEditing(false)
  }

  return (
    <main className="min-h-screen bg-[#F1F8E9] px-6 py-10 text-[#243126]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#dfead8]">
          <div className="mb-3 inline-flex rounded-full bg-[#E6F2DE] px-4 py-2 text-sm font-semibold text-[#4F7A51]">
            Konto klienta
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-[#244126]">
                Twoje miejsce w Plonbli
              </h1>

              <p className="mt-3 max-w-2xl text-[#61705f]">
                Tutaj znajdziesz swoje ulubione gospodarstwa i w przyszłości także historię zamówień.
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-2xl border border-[#d3e5cb] bg-white px-5 py-3 font-bold text-[#2E7D32] shadow-sm transition hover:bg-[#f7fbf2]"
              >
                Edytuj profil
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.5rem] bg-[#F8FBF4] p-6 ring-1 ring-[#e5efe0]">
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#445642]">
                      Imię / nazwa użytkownika
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-[#d6e5cf] bg-white px-4 py-3 outline-none focus:border-[#2E7D32]"
                      placeholder="Np. Ania"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#445642]">
                      Miasto
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-[#d6e5cf] bg-white px-4 py-3 outline-none focus:border-[#2E7D32]"
                      placeholder="Np. Warszawa"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#445642]">
                      O mnie
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      className="h-28 w-full rounded-2xl border border-[#d6e5cf] bg-white px-4 py-3 outline-none focus:border-[#2E7D32]"
                      placeholder="Napisz krótko, czego szukasz w Plonbli."
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="rounded-2xl bg-[#2E7D32] px-6 py-3 font-bold text-white shadow-md transition hover:opacity-95"
                    >
                      Zapisz profil
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="rounded-2xl border border-[#d3e5cb] bg-white px-6 py-3 font-bold text-[#2E7D32] shadow-sm transition hover:bg-[#f7fbf2]"
                    >
                      Anuluj
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F7A51]">
                    Profil użytkownika
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold text-[#244126]">
                    {profile.name || "Nowy użytkownik"}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#E6F2DE] px-3 py-1 text-sm font-semibold text-[#4F7A51]">
                      Konto aktywne
                    </span>

                    {profile.city && (
                      <span className="rounded-full bg-[#E6F2DE] px-3 py-1 text-sm font-semibold text-[#4F7A51]">
                        {profile.city}
                      </span>
                    )}
                  </div>

                  <p className="mt-5 max-w-2xl text-[#61705f]">
                    {profile.bio ||
                      "Uzupełnij krótki opis swojego profilu, żeby konto wyglądało bardziej osobiście i gotowo do testów demo."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 self-end sm:flex-row lg:flex-col">
              <Link
                href="/#gospodarstwa"
                className="rounded-2xl bg-[#2E7D32] px-6 py-3 text-center font-bold text-white shadow-md transition hover:opacity-95"
              >
                Odkrywaj gospodarstwa
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-[#d3e5cb] bg-white px-6 py-3 text-center font-bold text-[#2E7D32] shadow-sm transition hover:bg-[#f7fbf2]"
              >
                Wróć na start
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#dfead8]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2C4A2E]">
                  Moje ulubione gospodarstwa
                </h2>
                <p className="mt-1 text-sm text-[#6b7a68]">
                  Zapisane miejsca, do których chcesz wracać.
                </p>
              </div>

              <div className="rounded-full bg-[#F1F8E9] px-3 py-1 text-sm font-semibold text-[#4F7A51]">
                {favoriteFarms.length}
              </div>
            </div>

            {favoriteFarms.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-[#d8e7d1] bg-[#fbfdf8] p-8 text-center">
                <p className="text-lg font-semibold text-[#445642]">
                  Nie masz jeszcze ulubionych gospodarstw
                </p>
                <p className="mt-2 text-sm text-[#70806d]">
                  Klikaj serduszka przy gospodarstwach, a pojawią się tutaj.
                </p>

                <Link
                  href="/#gospodarstwa"
                  className="mt-5 inline-flex rounded-2xl bg-[#2E7D32] px-5 py-3 font-bold text-white shadow-md transition hover:opacity-95"
                >
                  Przeglądaj gospodarstwa
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteFarms.map((farm) => (
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

                      <h3 className="text-xl font-bold text-[#314830]">
                        {farm.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-[#6c7b69]">
                        {farm.description}
                      </p>

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
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#dfead8]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#2C4A2E]">
                    Moje zamówienia
                  </h2>
                  <p className="mt-1 text-sm text-[#6b7a68]">
                    Twoje ostatnie zamówienia złożone przez Plonbli.
                  </p>
                </div>

                <div className="rounded-full bg-[#F1F8E9] px-3 py-1 text-sm font-semibold text-[#4F7A51]">
                  {orders.length}
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="mt-5 rounded-[1.5rem] bg-[#F8FBF4] p-5 ring-1 ring-[#e5efe0]">
                  <p className="font-semibold text-[#445642]">
                    Nie masz jeszcze zamówień
                  </p>
                  <p className="mt-2 text-sm text-[#70806d]">
                    Gdy złożysz pierwsze zamówienie, zobaczysz je tutaj.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-[1.5rem] border border-[#e4efdc] bg-[#fcfef9] p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#4F7A51]">
                            Zamówienie #{order.id}
                          </p>
                          <p className="mt-1 text-sm text-[#70806d]">
                            {new Date(order.createdAt).toLocaleString("pl-PL")}
                          </p>
                        </div>

                        <div className="rounded-full bg-[#E8F5E9] px-3 py-1 text-sm font-bold text-[#2E7D32]">
                          {order.status === "new" ? "Nowe" : order.status}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.cartItemId}
                            className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[#edf4e8]"
                          >
                            <div>
                              <p className="font-semibold text-[#314830]">
                                {item.name}
                              </p>
                              <p className="text-sm text-[#70806d]">
                                Gospodarstwo ID: {item.farmId}
                              </p>
                            </div>

                            <div className="text-sm font-bold text-[#2E7D32]">
                              {item.price}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-xl bg-[#F1F8E9] p-4">
                        <p className="text-sm text-[#5b6b58]">
                          <span className="font-semibold">Odbiór:</span>{" "}
                          {order.pickupMethod === "pickup"
                            ? "Odbiór osobisty"
                            : "Punkt odbioru"}
                        </p>
                        <p className="mt-1 text-sm text-[#5b6b58]">
                          <span className="font-semibold">Płatność:</span> bezpośrednio u rolnika
                        </p>
                        <p className="mt-2 text-base font-bold text-[#2E7D32]">
                          Suma: {order.total.toFixed(2)} zł
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#dfead8]">
              <h2 className="text-2xl font-extrabold text-[#2C4A2E]">
                Szybkie akcje
              </h2>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/#gospodarstwa"
                  className="rounded-2xl border border-[#d6e5cf] bg-[#F8FBF4] px-4 py-3 font-semibold text-[#2E7D32] transition hover:bg-[#eef7e8]"
                >
                  Odkrywaj nowe gospodarstwa
                </Link>

                <Link
                  href="/cart"
                  className="rounded-2xl border border-[#d6e5cf] bg-[#F8FBF4] px-4 py-3 font-semibold text-[#2E7D32] transition hover:bg-[#eef7e8]"
                >
                  Przejdź do koszyka
                </Link>

                <Link
                  href="/messages"
                  className="rounded-2xl border border-[#d6e5cf] bg-[#F8FBF4] px-4 py-3 font-semibold text-[#2E7D32] transition hover:bg-[#eef7e8]"
                >
                  Otwórz wiadomości
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}