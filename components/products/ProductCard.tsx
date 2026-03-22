import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isOwner?: boolean;
  onDelete?: (productId: string) => void;
}

export function ProductCard({
  product,
  isOwner = false,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Brak zdjęcia
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-lg font-semibold">{product.name}</h3>

        <p className="text-sm text-gray-600">
          {Number(product.price).toFixed(2)} zł/kg
        </p>

        <p className="text-sm font-medium text-green-700">
          Dostępne: {Number(product.quantityAvailable)} kg
        </p>
      </div>

      {isOwner && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="mt-4 rounded-xl border px-3 py-2 text-sm font-medium"
        >
          Usuń produkt
        </button>
      )}
    </div>
  );
}