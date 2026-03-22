"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import FarmerNavMenu from "@/components/FarmerNavMenu"
import MessagesNavLink from "../components/MessagesNavLink"
import CartNavLink from "../components/CartNavLink"
import { store, type UserRole } from "@/lib/store"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [auth, setAuth] = useState<{
    isLoggedIn: boolean
    role: UserRole | null
  }>({
    isLoggedIn: false,
    role: null,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    setAuth(store.getAuth())

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    setAuth(store.getAuth())
    setMobileMenuOpen(false)
  }, [pathname])

  function handleLogout() {
    store.logout()
    localStorage.removeItem("farmerLoggedIn")
    localStorage.removeItem("farmerFarmId")
    localStorage.removeItem("plonbli_user")
    localStorage.removeItem("plonbliDemoUser")
    setAuth({ isLoggedIn: false, role: null })
    setMobileMenuOpen(false)
    router.push("/login")
  }

  function handleGoToClientAccount() {
    setMobileMenuOpen(false)
    router.push("/account")
  }

  function handleGoToLogin() {
    setMobileMenuOpen(false)
    router.push("/login")
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-stone-200 bg-white shadow-md"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="text-2xl font-bold text-green-700">
          Plonbli
        </Link>

        {/* DESKTOP */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          <Link
            href="/"
            className="inline-flex h-10 items-center transition hover:text-green-700"
          >
            Start
          </Link>

          {auth.isLoggedIn && auth.role === "farmer" && <FarmerNavMenu />}

          {!auth.isLoggedIn && (
            <Link
              href="/login"
              className="inline-flex h-10 items-center transition hover:text-green-700"
            >
              Zaloguj się
            </Link>
          )}

          {auth.isLoggedIn && auth.role === "client" && (
            <button
              onClick={() => router.push("/account")}
              className="inline-flex h-10 items-center transition hover:text-green-700"
            >
              Konto klienta
            </button>
          )}

          <div className="inline-flex h-10 items-center">
            <MessagesNavLink />
          </div>

          <div className="inline-flex h-10 items-center">
            <CartNavLink />
          </div>

          {auth.isLoggedIn && (
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center text-red-600 transition hover:text-red-700"
            >
              Wyloguj
            </button>
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-green-500 hover:text-green-700 md:hidden"
          aria-label="Otwórz menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? "Zamknij" : "Menu"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4">
            <Link
              href="/"
              className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-700"
            >
              Start
            </Link>

            {!auth.isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Zaloguj się
                </Link>

                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                  Tryb demo: możesz zalogować się lub założyć nowe konto testowe.
                </p>
              </>
            )}

            {auth.isLoggedIn && auth.role === "client" && (
              <>
                <button
                  onClick={handleGoToClientAccount}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-700"
                >
                  Konto klienta
                </button>

                <button
                  onClick={handleGoToLogin}
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-left text-sm font-semibold text-green-800 transition hover:bg-green-100"
                >
                  Tryb demo / Zmień konto
                </button>
              </>
            )}

            {auth.isLoggedIn && auth.role === "farmer" && (
              <>
                <Link
                  href="/dashboard/farm-profile"
                  className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-700"
                >
                  Profil gospodarstwa
                </Link>

                <Link
                  href="/dashboard/add-product"
                  className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-700"
                >
                  Dodaj produkt
                </Link>

                <button
                  onClick={handleGoToLogin}
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-left text-sm font-semibold text-green-800 transition hover:bg-green-100"
                >
                  Tryb demo / Zmień konto
                </button>
              </>
            )}

            <div className="rounded-xl px-4 py-3">
              <MessagesNavLink />
            </div>

            <div className="rounded-xl px-4 py-3">
              <CartNavLink />
            </div>

            {auth.isLoggedIn && (
              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
              >
                Wyloguj
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}