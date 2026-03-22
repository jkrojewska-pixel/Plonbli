"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUser, store } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState<"farmer" | "client">("client");
  const [farmName, setFarmName] = useState("");

  const handleRegister = () => {
    if (!name.trim()) return;

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
    };

    setUser(user);
    store.login(type);

    if (type === "farmer") {
      const farmerProfile = {
        userId: user.id,
        ownerName: name.trim(),
        farmName: farmName.trim() || "Nowe Gospodarstwo",
        description: "",
        location: "",
        products: [],
        avatar: "",
        coverImage: "",
      };

      localStorage.setItem(
        `plonbli_farmer_profile_${user.id}`,
        JSON.stringify(farmerProfile)
      );

      localStorage.setItem("farmerLoggedIn", "true");
      localStorage.setItem("farmerFarmId", user.id);

      localStorage.setItem(
        "plonbliDemoUser",
        JSON.stringify({
          role: "farmer",
          id: user.id,
          name: name.trim(),
          farmName: farmName.trim() || "Nowe Gospodarstwo",
        })
      );

      router.push("/dashboard/farm-profile");
      return;
    }

    const clientProfile = {
      userId: user.id,
      name: name.trim(),
      city: "",
      bio: "",
      favorites: [],
      orders: [],
    };

    localStorage.setItem(
      `plonbli_client_profile_${user.id}`,
      JSON.stringify(clientProfile)
    );

    localStorage.removeItem("farmerLoggedIn");
    localStorage.removeItem("farmerFarmId");

    localStorage.setItem(
      "plonbliDemoUser",
      JSON.stringify({
        role: "client",
        id: user.id,
        name: name.trim(),
      })
    );

    router.push("/");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Załóż konto (demo)</h1>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Twoja nazwa / imię"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {type === "farmer" && (
        <input
          className="w-full border p-2 mb-3"
          placeholder="Nazwa gospodarstwa"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
        />
      )}

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`flex-1 p-2 border ${
            type === "client" ? "bg-black text-white" : ""
          }`}
          onClick={() => setType("client")}
        >
          Klient
        </button>

        <button
          type="button"
          className={`flex-1 p-2 border ${
            type === "farmer" ? "bg-black text-white" : ""
          }`}
          onClick={() => setType("farmer")}
        >
          Rolnik
        </button>
      </div>

      <button
        type="button"
        className="w-full bg-green-600 text-white p-2"
        onClick={handleRegister}
      >
        Załóż konto
      </button>
    </div>
  );
}