"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { isAvailableNow } from "@/lib/products/status";
import type { Product } from "@/lib/products/types";
import { formatMoney } from "@/lib/utils/format";

export function ProductStickyCartBar({ product }: { product: Product }) {
  const { addItem } = useCart();
  const inStock = isAvailableNow(product);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-900/12 bg-cream-50/96 px-4 py-3 shadow-[0_-18px_45px_rgba(18,26,16,0.16)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-forest-900">
            {product.name}
          </p>
          <p className="text-xs font-bold text-forest-900/68">
            {formatMoney(product.price)}{" | "}
            {inStock ? "Available for request" : "Coming soon"}
          </p>
        </div>
        <Button
          disabled={!inStock}
          onClick={() => addItem(product, 1)}
          size="md"
        >
          <ShoppingBag aria-hidden className="size-4" />
          {inStock ? "Add" : "Soon"}
        </Button>
      </div>
    </div>
  );
}
