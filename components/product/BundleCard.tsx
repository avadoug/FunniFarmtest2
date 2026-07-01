import Image from "next/image";
import Link from "next/link";
import { PackageCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getProductStatusBadges } from "@/lib/products/status";
import type { Product } from "@/lib/products/types";
import { formatMoney } from "@/lib/utils/format";
import { getBundleSavings, getIncludedBundleProducts } from "@/lib/products/repository";

export function BundleCard({
  bundle,
  products,
}: {
  bundle: Product;
  products: Product[];
}) {
  const includedProducts = getIncludedBundleProducts(bundle, products);
  const savings = getBundleSavings(bundle);
  const statusBadges = getProductStatusBadges(bundle);

  return (
    <article className="grid overflow-hidden rounded-seed border border-forest-900/12 bg-cream-50 shadow-farm lg:grid-cols-[.85fr_1.15fr]">
      <Link
        className="relative min-h-[18rem] bg-cream-100"
        href={`/product/${bundle.slug}`}
      >
        <Image
          alt={bundle.name}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 36vw, 100vw"
          src={bundle.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/62 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge tone="gold">Bundle</Badge>
          {statusBadges.map((badge) => (
            <Badge key={badge.label} tone={badge.tone}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </Link>

      <div className="flex flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="green">Adult Hemp Products</Badge>
          <Badge tone="cream">Shipping Review</Badge>
          {savings > 0 && <Badge tone="gold">Save {formatMoney(savings)}</Badge>}
        </div>

        <h3 className="mt-4 font-display text-3xl font-black text-forest-900">
          {bundle.name}
        </h3>
        <p className="mt-3 leading-7 text-forest-900/72">
          {bundle.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap items-baseline gap-3">
          <p className="text-2xl font-black text-forest-900">
            {formatMoney(bundle.price)}
          </p>
          {bundle.compareAtPrice && (
            <p className="font-bold text-forest-900/48 line-through">
              {formatMoney(bundle.compareAtPrice)}
            </p>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-forest-900/10 bg-white/55 p-4">
          <div className="flex items-center gap-2">
            <PackageCheck aria-hidden className="size-5 text-forest-700" />
            <p className="text-xs font-black uppercase tracking-[0.16em] text-clay">
              Included products
            </p>
          </div>
          {includedProducts.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm font-bold text-forest-900/74">
              {includedProducts.map((product) => (
                <li className="flex items-center justify-between gap-3" key={product.id}>
                  <Link
                    className="hover:text-clay"
                    href={`/product/${product.slug}`}
                  >
                    {product.name}
                  </Link>
                  <span className="shrink-0 text-forest-900/48">
                    {formatMoney(product.price)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-forest-900/68">
              Bundle contents will appear here when this listing is opened for
              ordering.
            </p>
          )}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-forest-900/10 bg-harvest-300/55 p-4 text-sm leading-6 text-forest-900/76">
          <ShieldCheck aria-hidden className="mt-1 size-5 shrink-0 text-forest-700" />
          <p>
            Bundles are adult hemp products and remain subject to inventory,
            availability, COA, age, and shipping review before fulfillment.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/product/${bundle.slug}`}>View Bundle</ButtonLink>
          <ButtonLink href="/shop?category=Bundles" variant="ghost">
            Shop Bundles
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
