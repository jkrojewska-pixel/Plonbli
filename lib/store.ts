
export type FarmProfile = {
  coverImage: string
  farmName: string
  farmDescription: string
  location: string
}

export type Product = {
  id: number
  name: string
  price: string
  quantity?: string
  description: string
  image: string
}

export type UserRole = "farmer" | "client"

const FARM_PROFILE_KEY = "farmerFarmProfile"
const PRODUCTS_KEY = "farmerProducts"
const AUTH_KEY = "plonbli_auth"
const FAVORITE_FARMS_KEY = "plonbli_favorite_farms"

export const store = {
  // LOGIN

  login(role: UserRole) {
    if (typeof window === "undefined") return

    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        isLoggedIn: true,
        role,
      })
    )
  },

  logout() {
    if (typeof window === "undefined") return
    localStorage.removeItem(AUTH_KEY)
  },

  getAuth(): { isLoggedIn: boolean; role: UserRole | null } {
    if (typeof window === "undefined") {
      return { isLoggedIn: false, role: null }
    }

    const raw = localStorage.getItem(AUTH_KEY)

    if (!raw) {
      return { isLoggedIn: false, role: null }
    }

    try {
      return JSON.parse(raw)
    } catch {
      return { isLoggedIn: false, role: null }
    }
  },

  isFarmerLoggedIn(): boolean {
    const auth = this.getAuth()
    return auth.isLoggedIn && auth.role === "farmer"
  },

  isClientLoggedIn(): boolean {
    const auth = this.getAuth()
    return auth.isLoggedIn && auth.role === "client"
  },

  loginFarmer() {
    this.login("farmer")
  },

  logoutFarmer() {
    this.logout()
  },

  // FARM PROFILE

  getFarmProfile(): FarmProfile | null {
    if (typeof window === "undefined") return null

    const data = localStorage.getItem(FARM_PROFILE_KEY)
    return data ? JSON.parse(data) : null
  },

  saveFarmProfile(profile: FarmProfile) {
    if (typeof window === "undefined") return
    localStorage.setItem(FARM_PROFILE_KEY, JSON.stringify(profile))
  },

  // PRODUCTS

  getProducts(): Product[] {
    if (typeof window === "undefined") return []

    const data = localStorage.getItem(PRODUCTS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveProducts(products: Product[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  },

  addProduct(product: Product) {
    const products = this.getProducts()
    this.saveProducts([product, ...products])
  },

  deleteProduct(id: number) {
    const products = this.getProducts().filter((p) => p.id !== id)
    this.saveProducts(products)
  },
}

// FAVORITE FARMS

export function getFavoriteFarmIds(): string[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(FAVORITE_FARMS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isFarmFavorite(farmId: string): boolean {
  return getFavoriteFarmIds().includes(farmId)
}

export function toggleFavoriteFarm(farmId: string): string[] {
  const current = getFavoriteFarmIds()

  const updated = current.includes(farmId)
    ? current.filter((id) => id !== farmId)
    : [...current, farmId]

  if (typeof window !== "undefined") {
    localStorage.setItem(FAVORITE_FARMS_KEY, JSON.stringify(updated))
  }

  return updated
}
type Order = {
  id: number
  createdAt: string
  items: any[]
  total: number
  pickupMethod: "pickup" | "point"
  paymentMethod: "direct"
  status: "new"
}
export type UserType = "farmer" | "client";

export type DemoUser = {
  id: string;
  name: string;
  type: UserType;
};

const USER_KEY = "plonbli_user";

export function setUser(user: DemoUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}