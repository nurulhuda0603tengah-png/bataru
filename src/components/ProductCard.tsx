import { useState } from "react";
import type { CartItem } from "../types";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  tag: string;
  image: string;
};

type ProductCardProps = {
  product: Product;
  onAdd: () => void;
};

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'%3E%3Crect width='640' height='400' fill='%23f8fafc'/%3E%3Crect x='32' y='32' width='576' height='336' rx='32' fill='%23e2e8f0'/%3E%3Cpath d='M154 240l63-83 73 99 98-132 100 143' fill='none' stroke='%239ca3af' stroke-width='24' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='200' cy='190' r='28' fill='%23cbd5e1'/%3E%3C/svg%3E";

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(
    product.image?.trim() ? product.image : fallbackImage,
  );

  return (
    <article className="group overflow-hidden rounded-[2rem] bg-slate-50 shadow-glass ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImageSrc(fallbackImage)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-bataru-700/90 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white shadow-lg">
          {product.tag}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-800">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {product.description}
        </p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-slate-900">
            Rp{product.price.toLocaleString("id-ID")}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-full bg-bataru-700 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-bataru-700/30 transition duration-200 hover:bg-bataru-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-bataru-300"
          >
            Tambah
          </button>
        </div>
      </div>
    </article>
  );
}
