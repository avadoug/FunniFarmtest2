"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import {
  getBatchStatusLabel,
  getCoaStatusLabel,
  isAvailableNow,
} from "@/lib/products/status";
import type { Product } from "@/lib/products/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const inStock = isAvailableNow(product);

  return (
    <div className="seed-card rounded-seed p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-clay">
            Stock
          </p>
          <p className="mt-1 font-bold text-forest-900">
            {inStock
              ? `${product.inventory} available for order request`
              : "Coming soon"}
          </p>
        </div>
        <div className="flex items-center rounded-full border border-forest-900/15 bg-cream-50">
          <button
            aria-label="Decrease quantity"
            className="focus-ring rounded-full p-3"
            disabled={!inStock}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            type="button"
          >
            <Minus aria-hidden className="size-4" />
          </button>
          <span className="w-10 text-center font-black">{quantity}</span>
          <button
            aria-label="Increase quantity"
            className="focus-ring rounded-full p-3"
            disabled={!inStock}
            onClick={() =>
              setQuantity((current) => Math.min(product.inventory, current + 1))
            }
            type="button"
          >
            <Plus aria-hidden className="size-4" />
          </button>
        </div>
      </div>
      <Button
        className="mt-5 w-full"
        disabled={!inStock}
        onClick={() => addItem(product, quantity)}
        size="lg"
      >
        <ShoppingBag aria-hidden className="size-5" />
        {inStock ? "Add to Order Request" : "Coming Soon"}
      </Button>
      <div className="mt-4 grid gap-2 text-xs font-bold text-forest-900/70 sm:grid-cols-2">
        <span className="rounded-2xl border border-forest-900/10 bg-white/55 px-3 py-2">
          COA: {getCoaStatusLabel(product)}
        </span>
        <span className="rounded-2xl border border-forest-900/10 bg-white/55 px-3 py-2">
          Batch: {getBatchStatusLabel(product)}
        </span>
      </div>
      <p className="mt-4 text-xs leading-5 text-forest-900/62">
        Taxes, shipping, legal restrictions, and payment instructions are
        handled after order review. No card numbers are collected by this site.
      </p>
    </div>
  );
}
