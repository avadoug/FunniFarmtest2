import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Gift, SearchCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  hasBatchSpecificCoa,
  isAvailableNow,
} from "@/lib/products/status";
import type { Product } from "@/lib/products/types";
import { formatMoney } from "@/lib/utils/format";

export function FeaturedFarmPicks({ products }: { products: Product[] }) {
  const picks = buildPicks(products);

  if (picks.length === 0) return null;

  return (
    <section aria-labelledby="featured-farm-picks">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-clay">
            Featured Farm Picks
          </p>
          <h2
            className="mt-2 font-display text-3xl font-black text-forest-900 md:text-5xl"
            id="featured-farm-picks"
          >
            A few helpful places to start.
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-forest-900/72">
            These picks are internal shopping labels only. They help compare
            product formats and readiness, without making medical claims.
          </p>
        </div>
        <ButtonLink href="/shop" variant="ghost">
          Browse Farm Shelf
        </ButtonLink>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {picks.map((pick) => (
          <Link
            className="group seed-card overflow-hidden rounded-seed transition hover:-translate-y-1 hover:shadow-farm"
            href={`/product/${pick.product.slug}`}
            key={pick.label}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
              <Image
                alt={pick.product.name}
                className="object-cover transition duration-700 group-hover:scale-105"
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                src={pick.product.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/52 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <Badge tone={isAvailableNow(pick.product) ? "green" : "dark"}>
                  {isAvailableNow(pick.product) ? "Available Now" : "Coming Soon"}
                </Badge>
                {hasBatchSpecificCoa(pick.product) && (
                  <Badge tone="gold">COA Available</Badge>
                )}
              </div>
            </div>
            <div className="p-5">
              <pick.icon aria-hidden className="size-7 text-forest-700" />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-clay">
                {pick.label}
              </p>
              <h3 className="mt-2 font-display text-2xl font-black leading-tight text-forest-900">
                {pick.product.name}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-forest-900/68">
                {pick.text}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-black text-forest-900">
                  {formatMoney(pick.product.price)}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-black text-clay group-hover:text-forest-900">
                  Details
                  <ArrowRight aria-hidden className="size-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function buildPicks(products: Product[]) {
  const picks: Array<{
    icon: LucideIcon;
    label: string;
    product: Product;
    text: string;
  }> = [];

  const starter = products.find((product) => product.category === "CBG Gummies");
  if (starter) {
    picks.push({
      icon: Sparkles,
      label: "Best place to start",
      product: starter,
      text: "A familiar gummy format with label-backed serving details for adult shoppers.",
    });
  }

  const bundle = products.find((product) => product.category === "Bundles");
  if (bundle) {
    picks.push({
      icon: Gift,
      label: "Best for comparing formats",
      product: bundle,
      text: "A bundle listing for adults who want to compare farm shelf formats.",
    });
  }

  const lab = products.find(hasBatchSpecificCoa);
  if (lab) {
    picks.push({
      icon: SearchCheck,
      label: "Most educational",
      product: lab,
      text: "A COA-linked listing that shows how batch-specific transparency should work.",
    });
  }

  const comingSoon = products.find((product) => !isAvailableNow(product));
  if (comingSoon) {
    picks.push({
      icon: BadgeCheck,
      label: "Coming soon spotlight",
      product: comingSoon,
      text: "A preview item waiting on final product details, batch records, or availability.",
    });
  }

  return picks.slice(0, 4);
}
