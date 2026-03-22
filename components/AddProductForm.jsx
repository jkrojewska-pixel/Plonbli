"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AddProductForm({ onAddProduct }) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const farmerLoggedIn = localStorage.getItem("farmerLoggedIn")

    if (farmerLoggedIn !== "true") {
      router.push("/login")
      return
    }
  }, [router])

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !price.trim() || !quantity.trim()) return

    const newProduct = {
      id: Date.now(),
      name,
      price,
      quantity,
      description,
    }

    onAddProduct(newProduct)

    setName("")
    setPrice("")
    setQuantity("")
    setDescription("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#dfead7]"
    >
      <h2 className="text-2xl font-bold text-[#2E7D32]">Dodaj produkt</h2>

      <div className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Nazwa produktu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-[#d7e7d0] px-4 py-3 outline-none"
        />

        <input
          type="number"
          placeholder="Cena za kg (zł), np. 9"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-2xl border border-[#d7e7d0] px-4 py-3 outline-none"
        />

        <input
          type="number"
          placeholder="Dostępna ilość (kg), np. 25"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-2xl border border-[#d7e7d0] px-4 py-3 outline-none"
        />

        <textarea
          placeholder="Opis produktu"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-2xl border border-[#d7e7d0] px-4 py-3 outline-none"
          rows={4}
        />

        <button
          type="submit"
          className="rounded-2xl bg-[#4CAF50] px-5 py-3 font-bold text-white shadow-sm"
        >
          Dodaj produkt
        </button>
      </div>
    </form>
  )
}