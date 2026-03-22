"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  clearCart,
  getCart,
  removeFromCart,
  type CartItem,
} from "../../lib/cart"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [pickupMethod, setPickupMethod] = useState<"pickup" | "point">("pickup")
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    setCartItems(getCart())
  }, [])

  function handleRemove(cartItemId: string) {
    removeFromCart(cartItemId)
    setCartItems(getCart())
  }

  function handleClear() {
    clearCart()
    setCartItems([])
  }

  function calculateTotal() {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price)
      return sum + (isNaN(price) ? 0 : price)
    }, 0)
  }

  function handlePlaceOrder() {
    if (cartItems.length === 0) return

    const existingOrders = JSON.parse(
      localStorage.getItem("plonbli_orders") || "[]"
    )

    const newOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      items: cartItems,
      total: calculateTotal(),
      pickupMethod,
      paymentMethod: "direct",
      status: "new",
    }

    const updatedOrders = [newOrder, ...existingOrders]

    localStorage.setItem("plonbli_orders", JSON.stringify(updatedOrders))
    localStorage.setItem("plonbli_cart", JSON.stringify([]))

    setCartItems([])
    setOrderSuccess(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-stone-50 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-700">Koszyk</p>
            <h1 className="mt-2 text-4xl font-bold text-stone-900">
              Twoje produkty
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Tutaj zobaczysz produkty dodane do koszyka.
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClear}
              className="rounded-2xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Wyczyść koszyk
            </button>
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          {cartItems.length === 0 ? (
            <div className="rounded-2xl bg-stone-50 p-8 text-center">
              <p className="text-lg font-semibold text-stone-800">
                Koszyk jest pusty
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Dodaj produkty z wybranego gospodarstwa.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex rounded-2xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Wróć na start
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex flex-col gap-4 rounded-2xl border border-stone-200 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-stone-900">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-stone-500">
                        Gospodarstwo ID: {item.farmId}
                      </p>
                      <p className="mt-2 font-medium text-green-700">
                        {item.price}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.cartItemId)}
                      className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                    >
                      Usuń
                    </button>
                  </div>
                ))}
              </div>

              {/* PODSUMOWANIE */}
              <div className="mt-8 rounded-2xl bg-[#F1F8E9] p-5 ring-1 ring-[#dfead8]">
                <p className="text-lg font-bold text-[#2E7D32]">
                  Suma: {calculateTotal().toFixed(2)} zł
                </p>
              </div>

              {/* ODBIÓR */}
              <div className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#dfead8]">
                <div>
                  <h2 className="text-xl font-extrabold text-[#2C4A2E]">
                    Sposób odbioru
                  </h2>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPickupMethod("pickup")}
                      className={`rounded-2xl px-4 py-4 text-left font-semibold transition ${
                        pickupMethod === "pickup"
                          ? "bg-[#2E7D32] text-white shadow-md"
                          : "bg-[#F1F8E9] text-[#2E7D32] ring-1 ring-[#d6e5cf]"
                      }`}
                    >
                      Odbiór osobisty
                    </button>

                    <button
                      type="button"
                      onClick={() => setPickupMethod("point")}
                      className={`rounded-2xl px-4 py-4 text-left font-semibold transition ${
                        pickupMethod === "point"
                          ? "bg-[#4CAF50] text-white shadow-md"
                          : "bg-[#F8FBF4] text-[#2E7D32] ring-1 ring-[#d6e5cf]"
                      }`}
                    >
                      Punkt odbioru
                    </button>
                  </div>
                </div>

                {/* PŁATNOŚĆ */}
                <div className="rounded-2xl bg-[#F8FBF4] p-5 ring-1 ring-[#e3eedc]">
                  <h3 className="text-lg font-bold text-[#2C4A2E]">
                    Płatność
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#61705f]">
                    Zapłacisz bezpośrednio u rolnika — gotówką, BLIK-iem albo
                    przelewem. Plonbli nie obsługuje jeszcze płatności online.
                  </p>
                </div>

                {/* BUTTON */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full rounded-2xl bg-[#2E7D32] px-6 py-4 text-base font-bold text-white shadow-md transition hover:opacity-95"
                >
                  Złóż zamówienie
                </button>

                {orderSuccess && (
                  <div className="rounded-2xl bg-[#E8F5E9] p-4 text-sm font-semibold text-[#2E7D32] ring-1 ring-[#cfe6d0]">
                    Zamówienie zapisane! Skontaktuj się z rolnikiem w celu
                    ustalenia odbioru i płatności.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}