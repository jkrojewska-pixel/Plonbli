"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MessagesNavLink() {
  const [count, setCount] = useState(0);

  function updateCount() {
    const stored = localStorage.getItem("plonbli_messages");
    if (!stored) {
      setCount(0);
      return;
    }

    try {
      const messages = JSON.parse(stored);
      setCount(messages.length);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => {
    updateCount();

    const handleFocus = () => updateCount();
    const handleStorage = () => updateCount();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
  <Link
    href="/messages"
    className="flex items-center gap-1 hover:text-green-700 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-green-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l9 6 9-6M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
      />
    </svg>

    <span>
      Wiadomości {count > 0 ? `(${count})` : ""}
    </span>
  </Link>
);
}