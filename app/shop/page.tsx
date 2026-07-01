import type { Metadata } from "next";
import Image from "next/image";
import { BundleCard } from "@/components/product/BundleCard";
import { FarmNote } from "@/components/brand/FarmNote";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductComparison } from "@/components/product/ProductComparison";
import { TrustBar } from "@/components/brand/TrustBar";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { farmImages } from "@/lib/brand/farmImages";
import { getProducts, isBundleProduct } from "@/lib/products/repository";
import { productCategories } from "@/lib/products/types";

export const metadata: Metadata = {
  title: "Shop Products",
  description:
    "Shop The Funni Farm non-intoxicating CBG-rich hemp wellness products, gummies, oils, flower, seeds, topicals, bundles, and merch.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const products = await getProducts();
  const params = await searchParams;
  const requestedCategory = params.category
    ? decodeURIComponent(params.category)
    : "All";
  const normalizedCategory =
    requestedCategory.trim().toLowerCase() === "bundle"
      ? "Bundles"
      : requestedCategory;
  const initialCategory = productCategories.includes(
    normalizedCategory as (typeof productCategories)[number],
  )
    ? normalizedCategory
    : "All";
  const bundleProducts = products.filter(isBundleProduct);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="The farm shelf" title="Shop Products">
        <p>
          Browse non-intoxicating CBG-rich hemp wellness products, including
          gummies, oils, hemp flower, seeds, topicals, capsules, bundles, merch,
          and future Funni Farm releases.
        </p>
      </SectionHeading>

      <div className="mt-7">
        <TrustBar compact />
      </div>

      <section className="mt-8 grid overflow-hidden rounded-[2rem] border border-forest-900/12 bg-forest-900 text-cream-50 shadow-farm lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative min-h-[18rem]">
          <Image
            alt={farmImages.cbgGummiesFrontLogo.alt}
            className="object-cover object-top"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            src={farmImages.cbgGummiesFrontLogo.src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/55 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-harvest-300">
            Label-backed product info
          </p>
          <h2 className="mt-3 font-display text-3xl font-black">
            Shop with product facts in view.
          </h2>
          <p className="mt-3 leading-7 text-cream-100/76">
            Product listings now pair real farm photos with extracted label
            details, adult-use language, batch notes, and COA links as final
            files are approved.
          </p>
          <div className="mt-6">
            <ButtonLink href="/product-finder" variant="secondary">
              Take the Product Finder Quiz
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <FarmNote
          eyebrow="Before you buy"
          title="Available means product-ready, not just in stock."
          tone="buy"
        >
          Adult hemp products stay Coming Soon until availability, batch status,
          COA status where required, and order-review needs are clear enough for
          customers.
        </FarmNote>
        <FarmNote
          eyebrow="Good to know"
          title="COA honesty matters on the farm shelf."
          tone="lab"
        >
          A product can be active for browsing while still waiting on final
          batch paperwork. The status badges show that honestly.
        </FarmNote>
      </div>

      {bundleProducts.length > 0 && (
        <section className="mt-8">
          <SectionHeading
            eyebrow="Bundles"
            title="Curated adult hemp bundles"
          >
            <p>
              Bundles display included products and compare-at savings, but
              final fulfillment is still subject to inventory, age, COA,
              shipping, and availability review.
            </p>
          </SectionHeading>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {bundleProducts.map((bundle) => (
              <BundleCard bundle={bundle} key={bundle.id} products={products} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <ProductFilters initialCategory={initialCategory} products={products} />
      </div>

      <section className="mt-14">
        <ProductComparison products={products} />
      </section>
    </div>
  );
}
