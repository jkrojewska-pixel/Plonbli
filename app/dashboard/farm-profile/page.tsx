"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { store } from "@/lib/store"
import { useRouter } from "next/navigation"

type FarmProfile = {
  coverImage: string
  farmName: string
  farmDescription: string
  location: string
}

type Product = {
  id: number
  name: string
  price: string
  quantity?: string
  description: string
  image: string
}

type OrderItem = {
  cartItemId: string
  farmId: number
  productId: number
  name: string
  price: string
  image?: string
}

type OrderStatus = "new" | "done"

type Order = {
  id: number
  createdAt: string
  items: OrderItem[]
  total: number
  pickupMethod: "pickup" | "point"
  paymentMethod: "direct"
  status: OrderStatus
  farmId?: number
}

const LEGACY_FARM_PROFILE_STORAGE_KEY = "farmerFarmProfile"
const LEGACY_FARM_PRODUCTS_STORAGE_KEY = "farmerProducts"
const ORDERS_STORAGE_KEY = "plonbli_orders"

const emptyProfile: FarmProfile = {
  coverImage: "",
  farmName: "",
  farmDescription: "",
  location: "",
}

export default function FarmProfilePage() {
  const router = useRouter()

  const [isChecking, setIsChecking] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [hasSavedProfile, setHasSavedProfile] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [coverImage, setCoverImage] = useState("")
  const [farmName, setFarmName] = useState("")
  const [farmDescription, setFarmDescription] = useState("")
  const [location, setLocation] = useState("")

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [savedProfile, setSavedProfile] = useState<FarmProfile | null>(null)

  function getProfileStorageKey(userId: string) {
    return `plonbli_farmer_profile_${userId}`
  }

  function getProductsStorageKey(userId: string) {
    return `plonbli_farmer_products_${userId}`
  }

  useEffect(() => {
    if (!store.isFarmerLoggedIn()) {
      router.push("/login")
      return
    }

    const farmerLoggedIn = localStorage.getItem("farmerLoggedIn")
    if (farmerLoggedIn !== "true") {
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

    const profileStorageKey = getProfileStorageKey(userId)
    const productsStorageKey = getProductsStorageKey(userId)

    const storedProfile = localStorage.getItem(profileStorageKey)
    const legacyStoredProfile = localStorage.getItem(LEGACY_FARM_PROFILE_STORAGE_KEY)
    const storedProducts = localStorage.getItem(productsStorageKey)
    const legacyStoredProducts = localStorage.getItem(LEGACY_FARM_PRODUCTS_STORAGE_KEY)
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    const currentFarmId = Number(userId)

    if (storedProfile) {
      const parsedProfile: FarmProfile = JSON.parse(storedProfile)
      setSavedProfile(parsedProfile)
      setCoverImage(parsedProfile.coverImage || "")
      setFarmName(parsedProfile.farmName || "")
      setFarmDescription(parsedProfile.farmDescription || "")
      setLocation(parsedProfile.location || "")
      setHasSavedProfile(true)
      setIsEditing(false)
    } else if (legacyStoredProfile && localStorage.getItem("farmerFarmId") === "1") {
      const parsedProfile: FarmProfile = JSON.parse(legacyStoredProfile)
      setSavedProfile(parsedProfile)
      setCoverImage(parsedProfile.coverImage || "")
      setFarmName(parsedProfile.farmName || "")
      setFarmDescription(parsedProfile.farmDescription || "")
      setLocation(parsedProfile.location || "")
      setHasSavedProfile(true)
      setIsEditing(false)
    } else {
      const initialProfile: FarmProfile = {
        coverImage: "",
        farmName: demoUser?.farmName || "",
        farmDescription: "",
        location: "",
      }

      setSavedProfile(null)
      setCoverImage(initialProfile.coverImage)
      setFarmName(initialProfile.farmName)
      setFarmDescription(initialProfile.farmDescription)
      setLocation(initialProfile.location)
      setHasSavedProfile(false)
      setIsEditing(true)
    }

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else if (legacyStoredProducts && localStorage.getItem("farmerFarmId") === "1") {
      setProducts(JSON.parse(legacyStoredProducts))
    } else {
      setProducts([])
    }

    if (storedOrders) {
      const parsedOrders: Order[] = JSON.parse(storedOrders)

      const normalizedOrders = parsedOrders.map((order) => ({
        ...order,
        status: order.status || "new",
      }))

      const myOrders = normalizedOrders.filter((order) => {
        if (typeof order.farmId === "number") {
          return order.farmId === currentFarmId
        }

        return order.items?.some((item) => item.farmId === currentFarmId)
      })

      setOrders(myOrders)
    }

    setIsChecking(false)
  }, [router])

  const productCount = useMemo(() => products.length, [products])
  const newOrdersCount = useMemo(
    () => orders.filter((order) => order.status === "new").length,
    [orders]
  )
  const completedOrdersCount = useMemo(
    () => orders.filter((order) => order.status === "done").length,
    [orders]
  )
  const totalOrdersCount = useMemo(() => orders.length, [orders])

  function resetFormWithSavedProfile() {
    if (!savedProfile) {
      setCoverImage("")
      setFarmDescription("")
      setLocation("")
      return
    }

    setCoverImage(savedProfile.coverImage)
    setFarmName(savedProfile.farmName)
    setFarmDescription(savedProfile.farmDescription)
    setLocation(savedProfile.location)
  }

  function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!currentUserId) return

    const trimmedFarmName = farmName.trim()
    const trimmedDescription = farmDescription.trim()
    const trimmedLocation = location.trim()
    const trimmedCoverImage = coverImage.trim()

    if (!trimmedFarmName || !trimmedDescription || !trimmedLocation) {
      alert("Uzupełnij nazwę farmy, opis oraz lokalizację.")
      return
    }

    const profileToSave: FarmProfile = {
      coverImage: trimmedCoverImage,
      farmName: trimmedFarmName,
      farmDescription: trimmedDescription,
      location: trimmedLocation,
    }

    localStorage.setItem(
      getProfileStorageKey(currentUserId),
      JSON.stringify(profileToSave)
    )

    const rawDemoUser = localStorage.getItem("plonbliDemoUser")
    const demoUser = rawDemoUser ? JSON.parse(rawDemoUser) : null

    localStorage.setItem(
      "plonbliDemoUser",
      JSON.stringify({
        ...demoUser,
        role: "farmer",
        id: currentUserId,
        farmName: trimmedFarmName,
      })
    )

    setSavedProfile(profileToSave)
    setHasSavedProfile(true)
    setIsEditing(false)
  }

  function handleStartEditing() {
    setIsEditing(true)
  }

  function handleCancelEditing() {
    resetFormWithSavedProfile()
    setIsEditing(false)
  }

  function handleMarkOrderDone(orderId: number) {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "done" as OrderStatus } : order
    )

    setOrders(updatedOrders)

    const allOrders: Order[] = JSON.parse(
      localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
    )

    const updatedAllOrders = allOrders.map((order) =>
      order.id === orderId ? { ...order, status: "done" as OrderStatus } : order
    )

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedAllOrders))
  }

  if (isChecking) {
    return (
      <main className="mx-auto max-w-6xl p-6 md:p-10">
        Ładowanie profilu gospodarstwa...
      </main>
    )
  }

  const profileToDisplay = savedProfile || emptyProfile

  return (
    <main className="mx-auto max-w-6xl space-y-10 p-6 md:p-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Panel rolnika
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Profil gospodarstwa
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Zarządzaj wizytówką swojego gospodarstwa, ofertą produktów i nowymi
            zamówieniami od klientów.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isEditing && hasSavedProfile && (
            <button
              onClick={handleStartEditing}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-800 shadow-sm transition hover:border-green-500 hover:text-green-700"
            >
              Edytuj profil
            </button>
          )}

          <Link
            href="/dashboard/add-product"
            className="rounded-xl bg-green-600 px-5 py-3 text-white shadow-sm transition hover:bg-green-700"
          >
            Dodaj produkt
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Produkty</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{productCount}</p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Nowe zamówienia</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {newOrdersCount}
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Zrealizowane</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {completedOrdersCount}
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Wszystkie zamówienia</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalOrdersCount}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          {isEditing ? (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {hasSavedProfile
                    ? "Edytuj profil gospodarstwa"
                    : "Utwórz profil gospodarstwa"}
                </h2>
                <p className="mt-2 text-gray-600">
                  Uzupełnij podstawowe informacje, które zobaczą klienci
                  odwiedzający Twoje gospodarstwo w aplikacji.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Zdjęcie w tle gospodarstwa (URL)
                  </label>
                  <input
                    type="text"
                    placeholder="Wklej link do zdjęcia w tle"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nazwa farmy
                  </label>
                  <input
                    type="text"
                    placeholder="Np. Zielone Wzgórze"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Opis gospodarstwa
                  </label>
                  <textarea
                    placeholder="Napisz 3-4 zdania o swoim gospodarstwie, produktach i tym, co je wyróżnia."
                    value={farmDescription}
                    onChange={(e) => setFarmDescription(e.target.value)}
                    className="h-32 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Lokalizacja
                  </label>
                  <input
                    type="text"
                    placeholder="Np. Siemiatycze, woj. podlaskie"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
                  >
                    Zapisz profil gospodarstwa
                  </button>

                  {hasSavedProfile && (
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="rounded-xl bg-gray-100 px-6 py-3 text-gray-800 transition hover:bg-gray-200"
                    >
                      Anuluj
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="relative h-64 bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 md:h-80">
                {profileToDisplay.coverImage ? (
                  <img
                    src={profileToDisplay.coverImage}
                    alt={profileToDisplay.farmName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-6 text-center">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                        Plonbli
                      </p>
                      <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                        Dodaj zdjęcie w tle swojego gospodarstwa
                      </h2>
                      <p className="mx-auto mt-3 max-w-xl text-gray-600">
                        Zdjęcie w tle sprawi, że profil będzie wyglądał bardziej
                        profesjonalnie i przyciągnie uwagę klientów.
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="max-w-3xl">
                    <p className="mb-2 text-sm text-white/80">
                      Gospodarstwo w Plonbli
                    </p>
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                      {profileToDisplay.farmName}
                    </h2>
                    <p className="mt-3 text-base text-white/90 md:text-lg">
                      {profileToDisplay.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                      O gospodarstwie
                    </p>
                    <p className="mt-4 whitespace-pre-line text-lg leading-8 text-gray-700">
                      {profileToDisplay.farmDescription}
                    </p>
                  </div>

                  <div className="min-w-[220px] rounded-2xl border border-green-100 bg-green-50 p-5">
                    <p className="text-sm font-medium text-green-800">
                      Szybki podgląd
                    </p>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Lokalizacja</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {profileToDisplay.location}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Liczba produktów</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {productCount}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          Profil aktywny
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Wskazówki
          </p>

          <h3 className="mt-3 text-xl font-bold text-gray-900">
            Jak sprawić, by profil wyglądał świetnie?
          </h3>

          <div className="mt-5 space-y-4 leading-7 text-gray-600">
            <p>
              Dodaj naturalne zdjęcie gospodarstwa lub pola jako tło — profil od
              razu będzie wyglądał bardziej profesjonalnie.
            </p>
            <p>
              W opisie napisz, co uprawiasz, jak pracujesz i czym wyróżnia się
              Twoje gospodarstwo.
            </p>
            <p>
              Uzupełnij produkty, żeby klient od razu zobaczył, co jest
              dostępne.
            </p>
            <p>
              Regularnie sprawdzaj nowe zamówienia i aktualizuj ich status, żeby
              klienci mieli poczucie szybkiej obsługi.
            </p>
          </div>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-[#dcebd7] bg-gradient-to-br from-[#F3FAEE] via-[#EEF8E8] to-[#F8FCF5] p-6 shadow-sm ring-1 ring-[#e5f0df] md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Zamówienia
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Nowe zamówienia od klientów
            </h2>
            <p className="mt-2 text-gray-600">
              Tutaj pojawiają się zamówienia złożone przez klientów w Plonbli.
            </p>
          </div>

          {newOrdersCount > 0 && (
            <div className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-[#2E7D32] shadow-sm ring-1 ring-[#cfe6d0]">
              Nowe: {newOrdersCount}
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#d6e7cf] bg-white/80 p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Nie masz jeszcze żadnych zamówień
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Gdy klient złoży pierwsze zamówienie, zobaczysz je tutaj wraz ze
              statusem i sposobem odbioru.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-[#dfead8] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-bold text-gray-900">
                        Zamówienie #{order.id}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          order.status === "new"
                            ? "bg-[#E8F5E9] text-[#2E7D32]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status === "new" ? "Nowe" : "Zrealizowane"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("pl-PL")}
                    </p>
                  </div>

                  {order.status === "new" && (
                    <button
                      onClick={() => handleMarkOrderDone(order.id)}
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      Oznacz jako zrealizowane
                    </button>
                  )}
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex items-center justify-between gap-4 rounded-xl bg-[#fcfef9] px-4 py-3 ring-1 ring-[#edf4e8]"
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

                  <div className="rounded-2xl bg-[#F1F8E9] p-4">
                    <p className="text-sm text-[#5b6b58]">
                      <span className="font-semibold">Odbiór:</span>{" "}
                      {order.pickupMethod === "pickup"
                        ? "Odbiór osobisty"
                        : "Punkt odbioru"}
                    </p>

                    <p className="mt-2 text-sm text-[#5b6b58]">
                      <span className="font-semibold">Płatność:</span>{" "}
                      bezpośrednio u rolnika
                    </p>

                    <p className="mt-3 text-lg font-bold text-[#2E7D32]">
                      Suma: {order.total.toFixed(2)} zł
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Oferta gospodarstwa
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Produkty gospodarstwa
            </h2>
            <p className="mt-2 text-gray-600">
              Tutaj widzisz produkty dodane przez rolnika do profilu
              gospodarstwa.
            </p>
          </div>

          <Link
            href="/dashboard/add-product"
            className="w-fit rounded-xl bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
          >
            Dodaj nowy produkt
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Nie masz jeszcze żadnych produktów
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Dodaj pierwszy produkt, aby klienci odwiedzający profil
              gospodarstwa mogli zobaczyć Twoją ofertę.
            </p>

            <Link
              href="/dashboard/add-product"
              className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
            >
              Przejdź do dodawania produktów
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="h-48 bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-gray-400">
                      Brak zdjęcia produktu
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    <span className="whitespace-nowrap font-semibold text-green-700">
                      {product.price} zł
                    </span>
                  </div>

                  {product.quantity && (
                    <p className="mt-3 text-gray-700">
                      Ilość: <span className="font-medium">{product.quantity}</span>
                    </p>
                  )}

                  <p className="mt-3 leading-7 text-gray-600">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}