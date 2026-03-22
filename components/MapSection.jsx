// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { farms } from "../data/farms";
import FarmMapSearch from "@/components/FarmMapSearch";

const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-cluster"),
  { ssr: false }
);

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

function isValidCoordinate(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function truncateText(text, maxLength = 120) {
  if (typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export default function MapSection() {
  // ✅ STATE wyszukiwania
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ FILTROWANIE farm (miasto + produkty)
  const filteredFarms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return farms;

    return farms.filter((farm) => {
      const matchesLocation =
        farm.location?.toLowerCase().includes(query) ||
        farm.name?.toLowerCase().includes(query);

      const matchesProducts = (farm.products ?? []).some((product) =>
        product.name?.toLowerCase().includes(query)
      );

      return matchesLocation || matchesProducts;
    });
  }, [searchTerm]);

  // ✅ tylko farmy z koordynatami
  const farmsWithCoordinates = filteredFarms.filter(
    (farm) => isValidCoordinate(farm.lat) && isValidCoordinate(farm.lng)
  );

  if (farmsWithCoordinates.length === 0) {
    return (
      <div className="space-y-4">
        {/* SEARCH */}
        <FarmMapSearch
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />

        {/* EMPTY STATE */}
        <div className="rounded-[1.5rem] border border-[#d9e7d2] bg-white p-6 text-sm text-[#5f735e]">
          Nie znaleziono gospodarstw dla tego wyszukiwania.
        </div>
      </div>
    );
  }

  const defaultCenter = [
    farmsWithCoordinates[0].lat,
    farmsWithCoordinates[0].lng,
  ];

  return (
    <div className="space-y-4">
      {/* ✅ SEARCHBAR */}
      <FarmMapSearch
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      /> <div className="flex items-center justify-between px-1">
  <div className="text-sm font-semibold text-[#2E7D32]">
    Znaleziono: {filteredFarms.length}
    
  </div>

  {searchTerm.trim() !== "" && (
    <div className="text-xs text-[#6a7768]">
      dla: "{searchTerm}"
    </div>
  )}
</div>

      {/* MAPA */}
      <div className="overflow-hidden rounded-[1.5rem] border border-[#d9e7d2]">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          maxZoom={18}
          scrollWheelZoom={true}
          className="h-[320px] w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup>
            {farmsWithCoordinates.map((farm) => (
              <Marker key={farm.id} position={[farm.lat, farm.lng]}>
                <Popup>
                  <div className="min-w-[190px]">
                    <div className="text-sm font-bold text-[#2E7D32]">
                      {farm.name || "Bez nazwy"}
                    </div>

                    <div className="mt-1 text-xs text-[#5f735e]">
                      {farm.location || "Brak lokalizacji"}
                    </div>

                    <div className="mt-2 text-xs text-[#4d654d]">
                      {truncateText(farm.description, 110)}
                    </div>

                    <Link
                      href={`/farm/${farm.id}`}
                      className="mt-3 inline-block rounded-xl bg-[#4CAF50] px-3 py-2 text-xs font-bold text-white"
                    >
                      Zobacz gospodarstwo
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}