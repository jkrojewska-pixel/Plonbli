export type CartItem = {
  cartItemId: string;
  id: number;
  name: string;
  price: string;
  farmId: number;
};

const CART_KEY = "plonbli_cart";
function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(CART_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    const normalizedCart: CartItem[] = parsed.map((item, index) => ({
      ...item,
      cartItemId:
        item.cartItemId ??
        `${item.id}-${item.farmId}-${Date.now()}-${index}`,
    }));

    localStorage.setItem(CART_KEY, JSON.stringify(normalizedCart));

    return normalizedCart;
  } catch {
    return [];
  }
}

export function addToCart(
  item: Omit<CartItem, "cartItemId">
) {
  const cart = getCart();

  const cartItem = {
    ...item,
    cartItemId: `${item.id}-${item.farmId}-${Date.now()}-${Math.random()}`
  };

  cart.push(cartItem);

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdated();
}
export function removeFromCart(cartItemId: string) {
  const cart = getCart();

  const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);

  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  notifyCartUpdated();
}
export function isInCart(itemId: number) {
  const cart = getCart();

  return cart.some((item) => item.id === itemId);
}


export function clearCart() {
  localStorage.removeItem(CART_KEY);
  notifyCartUpdated();
}
