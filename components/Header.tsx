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
  }, [pathname])

  function handleLogout() {
    store.logout()
    localStorage.removeItem("farmerLoggedIn")
    localStorage.removeItem("farmerFarmId")
    setAuth({ isLoggedIn: false, role: null })
    router.push("/")
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
      </div>
    </header>
  )
}