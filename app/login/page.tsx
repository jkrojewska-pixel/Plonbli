"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { store } from "@/lib/store"

export default function LoginPage() {
  const router = useRouter()

  function handleFarmerLogin() {
    store.login("farmer")

    // kompatybilność ze starszą logiką
    localStorage.setItem("farmerLoggedIn", "true")
    localStorage.setItem("farmerFarmId", "1")

    router.push("/dashboard/farm-profile")
  }

  function handleClientLogin() {
    store.login("client")

    // czyścimy stare dane rolnika
    localStorage.removeItem("farmerLoggedIn")
    localStorage.removeItem("farmerFarmId")

    router.push("/")
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <h1 className="mb-3 text-3xl font-bold">Logowanie</h1>

      <p className="mb-8 text-gray-600">
        Wybierz sposób logowania do wersji testowej Plonbli.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleClientLogin}
          className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Zaloguj jako klient
        </button>

        <button
          onClick={handleFarmerLogin}
          className="rounded-xl bg-green-700 px-6 py-3 text-white hover:bg-green-800"
        >
          Zaloguj jako rolnik
        </button>
      </div>

      <div className="mt-6 text-center">
        <Link href="/register" className="text-green-700 underline">
          Załóż konto (demo)
        </Link>
      </div>
    </main>
  )
}