"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Product = {
  id: number
  name: string
  price: string
  quantity: string
  description: string
  image: string
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

export default function AddProductPage() {
  const router = useRouter()

  const [isChecking, setIsChecking] = useState(true)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const farmerLoggedIn = localStorage.getItem("farmerLoggedIn")

    if (farmerLoggedIn !== "true") {
      router.push("/login")
      return
    }

    const savedProducts = JSON.parse(
      localStorage.getItem("farmerProducts") || "[]"
    ) as Product[]

    setProducts(savedProducts)
    setIsChecking(false)
  }, [router])

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const base64 = await fileToBase64(file)
      setImage(base64)
    } catch (error) {
      console.error("Błąd podczas wczytywania zdjęcia:", error)
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newProduct: Product = {
      id: Date.now(),
      name,
      price,
      quantity,
      description,
      image,
    }

    const existingProducts = JSON.parse(
      localStorage.getItem("farmerProducts") || "[]"
    ) as Product[]

    const updatedProducts = [newProduct, ...existingProducts]

    localStorage.setItem("farmerProducts", JSON.stringify(updatedProducts))
    setProducts(updatedProducts)

    setName("")
    setPrice("")
    setQuantity("")
    setDescription("")
    setImage("")
  }

  function handleDeleteProduct(id: number) {
    const updatedProducts = products.filter((product) => product.id !== id)
    localStorage.setItem("farmerProducts", JSON.stringify(updatedProducts))
    setProducts(updatedProducts)
  }

  if (isChecking) {
    return <main className="mx-auto max-w-3xl p-10">Ładowanie...</main>
  }

  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-8 text-3xl font-bold">Dodaj produkt</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-white p-6 shadow-lg"
      >
        <input
          type="text"
          placeholder="Nazwa produktu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="number"
          placeholder="Cena za kg (zł) np. 9"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="number"
          placeholder="Dostępna ilość (kg), np. 25"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        <textarea
          placeholder="Opis produktu"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-24 w-full rounded-lg border p-3"
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-stone-700">
            Zdjęcie produktu
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full rounded-lg border p-3"
          />

          {image && (
            <img
              src={image}
              alt="Podgląd zdjęcia produktu"
              className="h-40 w-full rounded-xl object-cover"
            />
          )}
        </div>

        <button className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700">
          Dodaj produkt
        </button>
      </form>

      <div className="mt-12 space-y-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex gap-4">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-28 w-28 rounded-lg object-cover"
                />
              )}

              <div>
                <h3 className="text-xl font-semibold">{p.name}</h3>

                <p className="font-medium text-green-700">
                  {Number(p.price)} zł/kg
                </p>

                <p className="mt-1 text-gray-700">
                  Ilość: {Number(p.quantity)} kg
                </p>

                <p className="mt-2 text-gray-600">{p.description}</p>
              </div>
            </div>

            <div className="flex items-start">
              <button
                type="button"
                onClick={() => handleDeleteProduct(p.id)}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}