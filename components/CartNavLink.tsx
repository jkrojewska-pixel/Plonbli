"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "../lib/cart";

export default function CartNavLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
  setCount(getCart().length);
};

updateCount();

window.addEventListener("focus", updateCount);
window.addEventListener("storage", updateCount);
window.addEventListener("cartUpdated", updateCount);

return () => {
  window.removeEventListener("focus", updateCount);
  window.removeEventListener("storage", updateCount);
  window.removeEventListener("cartUpdated", updateCount);
};
    setCount(getCart().length);

    const handleFocus = () => {
      setCount(getCart().length);
    };

    const handleStorage = () => {
      setCount(getCart().length);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <Link href="/cart" className="hover:text-green-700 transition">
      Koszyk {count > 0 ? `(${count})` : ""}
    </Link>
  );
}
