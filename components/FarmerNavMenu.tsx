"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export default function FarmerNavMenu() {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement | null>(null)

  const [isFarmerLoggedIn, setIsFarmerLoggedIn] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const farmerLoggedIn = localStorage.getItem("farmerLoggedIn")
    setIsFarmerLoggedIn(farmerLoggedIn === "true")
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return

      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem("farmerLoggedIn")
    localStorage.removeItem("farmerLoggedInEmail")
    setIsFarmerLoggedIn(false)
    setIsOpen(false)
    window.location.href = "/"
  }

  if (!isFarmerLoggedIn) {
    return (
      <>
        <Link
          href="/farmers"
          className="inline-flex items-center h-10 hover:text-green-700 transition"
        >
          Dla rolników
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center h-10 hover:text-green-700 transition"
        >
          Zaloguj się
        </Link>
      </>
    )
  }

  return (
    <div className="relative flex items-center gap-3" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center h-10 font-medium hover:text-green-700 transition"
      >
        Moje gospodarstwo
      </button>

      <Link
        href="/dashboard/add-product"
        className="inline-flex items-center h-10 rounded-lg bg-green-600 px-4 text-white hover:bg-green-700 transition"
      >
        Dodaj produkt
      </Link>

      {isOpen && (
        <div className="absolute right-0 top-12 z-[100] w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <Link
            href="/dashboard/farm-profile"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-4 py-3 hover:bg-green-50 transition"
          >
            Mój profil
          </Link>

          <Link
            href="/dashboard/add-product"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-4 py-3 hover:bg-green-50 transition"
          >
            Dodaj produkt
          </Link>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50 transition"
          >
            Wyloguj
          </button>
        </div>
      )}
    </div>
  )
}