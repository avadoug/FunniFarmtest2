"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import {
  getCoaStatusLabel,
  isAvailableNow,
} from "@/lib/products/status";
import { productCategories, type Product } from "@/lib/products/types";
import { cn } from "@/lib/utils/cn";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Name A-Z", value: "name" },
  { label: "Price Low", value: "price-asc" },
  { label: "Price Desc", value: "price-desc" },
  { label: "Format", value: "format" },
  { label: "Availability", value: "availability" },
  { label: "Newest", value: "newest" },
] as const;

const wellnessFilters = [
  "Available Now",
  "Coming Soon",
  "Non-Intoxicating",
  "CBG",
  "Hemp Wellness",
  "COA Available",
  "COA Pending",
  "Small Batch",
  "Adult Use",
] as const;

export function ProductFilters({
  initialCategory = "All",
  products,
}: {
  initialCategory?: string;
  products: Product[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [wellnessTag, setWellnessTag] = useState("All");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>(
    "featured",
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) =>
        category === "All" ? true : product.category === category,
      )
      .filter((product) =>
        wellnessTag === "All" ? true : matchesWellnessFilter(product, wellnessTag),
      )
      .filter((product) => {
        if (!query) return true;
        return [
          product.name,
          product.shortDescription,
          product.category,
          product.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "format") return a.category.localeCompare(b.category);
        if (sort === "availability") {
          return Number(isAvailableNow(b)) - Number(isAvailableNow(a));
        }
        if (sort === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return Number(b.isFeatured) - Number(a.isFeatured);
      });
  }, [category, products, search, sort, wellnessTag]);

  return (
    <div>
      <div className="seed-card rounded-seed p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search
              aria-hidden
              className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-forest-900/50"
            />
            <input
              className="focus-ring min-h-12 w-full rounded-full border border-forest-900/15 bg-white/75 pl-12 pr-4 text-sm font-semibold text-forest-900 placeholder:text-forest-900/45"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search seeds, CBG, oils, flower..."
              value={search}
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Sort products</span>
            <SlidersHorizontal
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-forest-900/50"
            />
            <select
              className="focus-ring min-h-12 w-full appearance-none rounded-full border border-forest-900/15 bg-white/75 pl-12 pr-10 text-sm font-black text-forest-900 lg:w-48"
              onChange={(event) =>
                setSort(event.target.value as typeof sort)
              }
              value={sort}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {["All", ...productCategories].map((item) => (
            <button
              className={cn(
                "focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
                category === item
                  ? "border-forest-900 bg-forest-700 text-cream-50"
                  : "border-forest-900/15 bg-white/60 text-forest-900 hover:bg-forest-700/10",
              )}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", ...wellnessFilters].map((item) => (
            <button
              className={cn(
                "focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
                wellnessTag === item
                  ? "border-forest-900 bg-harvest-300 text-forest-900"
                  : "border-forest-900/15 bg-white/60 text-forest-900 hover:bg-harvest-300/40",
              )}
              key={item}
              onClick={() => setWellnessTag(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm font-bold text-forest-900/65">
        <p>
          Showing {filtered.length} of {products.length} products
        </p>
        <p>Availability and restrictions confirmed at checkout.</p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-seed border border-dashed border-forest-900/25 bg-cream-50/70 p-10 text-center">
          <h2 className="font-display text-2xl font-black text-forest-900">
            No products match those filters
          </h2>
          <p className="mt-2 text-forest-900/70">
            Try clearing one and checking the farm shelf again.
          </p>
        </div>
      )}
    </div>
  );
}

function matchesWellnessFilter(product: Product, filter: string) {
  if (filter === "Available Now") return isAvailableNow(product);
  if (filter === "Coming Soon") return !isAvailableNow(product);
  if (filter === "COA Available" || filter === "COA Pending") {
    return getCoaStatusLabel(product) === filter;
  }

  return product.tags.includes(filter);
}
