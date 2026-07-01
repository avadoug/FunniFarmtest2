import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  FlaskConical,
  HeartHandshake,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { FarmNote } from "@/components/brand/FarmNote";
import { OrderRequestFlow } from "@/components/brand/OrderRequestFlow";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductLabelFacts } from "@/components/product/ProductLabelFacts";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductStickyCartBar } from "@/components/product/ProductStickyCartBar";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { TrustBar } from "@/components/brand/TrustBar";
import { jackFrostCoa } from "@/lib/coa/jackFrostCbg001";
import { productLabelFacts } from "@/lib/products/labelFacts";
import {
  getBatchStatusLabel,
  getCoaStatusLabel,
  getProductStatusBadges,
  hasBatchSpecificCoa,
  isAvailableNow,
  requiresCoa,
} from "@/lib/products/status";
import type { Product } from "@/lib/products/types";
import {
  getBundleSavings,
  getIncludedBundleProducts,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  isBundleProduct,
} from "@/lib/products/repository";
import { formatMoney } from "@/lib/utils/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | CBG-Rich Hemp Wellness`,
    description: `${product.shortDescription} Batch details, ingredients, COA links where available, and adult-use hemp product notes from The Funni Farm.`,
    openGraph: {
      title: `${product.name} | The Funni Farm`,
      description: `${product.shortDescription} CBG-rich adult hemp wellness from The Funni Farm.`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) redirect("/shop");

  const [relatedProducts, allProducts] = await Promise.all([
    getRelatedProducts(product, 4),
    getProducts(),
  ]);
  const gallery = [product.image, ...product.gallery].filter(
    (image, index, all) => all.indexOf(image) === index,
  );
  const hasJackFrostCoa = product.slug === "cbg-hemp-flower";
  const labelFacts = productLabelFacts[product.slug];
  const isBundle = isBundleProduct(product);
  const includedBundleProducts = isBundle
    ? getIncludedBundleProducts(product, allProducts)
    : [];
  const bundleSavings = getBundleSavings(product);
  const bestForChips = getBestForChips(product);
  const faqs = getProductFaqs(product);
  const statusBadges = getProductStatusBadges(product);
  const hasCoa = hasBatchSpecificCoa(product);

  return (
    <div className="pb-24 md:pb-0">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          className="focus-ring inline-flex rounded-full text-sm font-black text-clay hover:text-forest-900"
          href="/shop"
        >
          Back to shop
        </Link>
        <section className="paper-texture mt-6 overflow-hidden rounded-[2rem] border border-forest-900/12 bg-cream-50 shadow-farm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
            <div className="bg-gradient-to-br from-cream-100 via-cream-50 to-harvest-100/55 p-4 sm:p-6 lg:p-8">
              <ProductGallery images={gallery} name={product.name} />
            </div>
            <div className="relative z-10 flex flex-col p-6 md:p-8 lg:p-10">
          <div className="flex flex-wrap gap-2">
            {product.badge && <Badge tone="gold">{product.badge}</Badge>}
            <Badge tone="purple">{product.category}</Badge>
            <Badge tone="green">Non-Intoxicating</Badge>
            {product.category.includes("CBG") || product.tags.includes("CBG") ? (
              <Badge tone="cream">CBG Rich</Badge>
            ) : null}
            {statusBadges.map((badge) => (
              <Badge key={badge.label} tone={badge.tone}>
                {badge.label}
              </Badge>
            ))}
            {product.ageRestricted && <Badge tone="dark">Adult Use</Badge>}
          </div>
          <h1 className="mt-5 font-display text-4xl font-black leading-tight text-forest-900 md:text-6xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-black text-forest-900">
              {formatMoney(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-lg font-bold text-forest-900/45 line-through">
                {formatMoney(product.compareAtPrice)}
              </p>
            )}
            <StockPill product={product} />
          </div>
          <p className="mt-5 text-lg leading-8 text-forest-900/75">
            {product.fullDescription}
          </p>
          <BestForChips chips={bestForChips} />
          <div className="mt-6">
            <ProductPurchasePanel product={product} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {hasCoa ? (
              <ButtonLink href={product.coaUrl} variant="secondary">
                View COA / Lab Results
              </ButtonLink>
            ) : (
              <div className="rounded-full border border-dashed border-forest-900/20 px-4 py-3 text-center text-sm font-black text-forest-900/60">
                {requiresCoa(product) ? "COA Pending" : "COA Not Applicable"}
              </div>
            )}
            <ButtonLink href="/product-finder" variant="ghost">
              Find My Product Fit
            </ButtonLink>
          </div>
          <div className="mt-5 rounded-seed border border-forest-900/10 bg-white/55 p-4 text-sm leading-6 text-forest-900/72">
            <p className="font-black text-forest-900">
              Farm-direct order review
            </p>
            <p className="mt-1">
              Checkout creates an order request. The Funni Farm reviews
              availability, age requirements, shipping rules, and product
              details before emailing payment options.
            </p>
          </div>
          {hasJackFrostCoa && (
            <div className="mt-6 rounded-seed border border-harvest-700/35 bg-harvest-300 p-5 text-forest-900 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.18em]">
                Tested, not guessed
              </p>
              <h2 className="mt-2 font-display text-2xl font-black">
                Jack Frost COA available
              </h2>
              <p className="mt-2 text-sm leading-6 text-forest-900/76">
                New Bloom Labs reported Total THC 0.113%, Delta-9 THC 0.019%,
                and CBGA 9.268% for the tested plant/biomass sample.
              </p>
              <Link
                className="focus-ring mt-3 inline-flex rounded-full font-black text-forest-900 underline decoration-clay/40 underline-offset-4 hover:text-clay"
                href={`/lab-results#${jackFrostCoa.id}`}
              >
                Read the COA breakdown
              </Link>
            </div>
          )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FactCard
            icon={PackageCheck}
            label="Serving / format"
            value={getServingInfo(product)}
          />
          <FactCard
            icon={FileText}
            label="Batch number"
            value={getBatchStatusLabel(product)}
          />
          <FactCard
            icon={FlaskConical}
            label="COA status"
            value={getCoaStatusLabel(product)}
          />
          <FactCard
            icon={ShieldCheck}
            label="Adult-use note"
            value={
              product.ageRestricted
                ? "Adult hemp product. Age and location review may apply."
                : "No adult-use restriction configured for this listing."
            }
          />
        </section>

        <div className="mt-8">
          <TrustBar compact />
        </div>

      {labelFacts && <ProductLabelFacts facts={labelFacts} />}

      {isBundle && (
        <section className="mt-14 rounded-seed border border-forest-900/12 bg-cream-50 p-6 shadow-farm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-clay">
                Bundle contents
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-forest-900">
                Included products and savings
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-forest-900/72">
                This bundle is an adult hemp product listing with its own
                configured price. Automatic cart discounts are not implemented
                yet. Fulfillment is subject to availability and shipping review.
              </p>
            </div>
            {bundleSavings > 0 && (
              <Badge tone="gold">Bundle savings {formatMoney(bundleSavings)}</Badge>
            )}
          </div>

          {includedBundleProducts.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {includedBundleProducts.map((included) => (
                <Link
                  className="rounded-2xl border border-forest-900/10 bg-white/55 p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
                  href={`/product/${included.slug}`}
                  key={included.id}
                >
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-clay">
                    Included
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black text-forest-900">
                    {included.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-forest-900/70">
                    {included.shortDescription}
                  </p>
                  <p className="mt-3 font-black text-forest-900">
                    {formatMoney(included.price)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-forest-900/20 bg-white/55 p-5 text-forest-900/70">
              Bundle contents will appear here when this listing is opened for
              ordering.
            </p>
          )}
        </section>
      )}

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_.82fr]">
        <section className="seed-card rounded-seed p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-clay">
                Review before ordering
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-forest-900">
                Product facts
              </h2>
            </div>
            {hasCoa && (
              <ButtonLink href={product.coaUrl} variant="ghost">
                Open COA
              </ButtonLink>
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Spec label="Category" value={product.category} />
            <Spec label="Weight" value={product.weight || "Not listed"} />
            <Spec label="Pack size" value={product.packSize || "Not listed"} />
            <Spec label="Serving info" value={getServingInfo(product)} />
            <Spec
              label="Batch number"
              value={getBatchStatusLabel(product)}
            />
            <Spec
              label="Seed type"
              value={product.seedType || "Not applicable"}
            />
            <Spec
              label="Lineage"
              value={product.strainLineage || "Not listed"}
            />
          </div>
          <div className="hand-divider my-8" />
          <ContentBlock icon={FileText} title="Ingredients">
            {product.ingredients || "Ingredients are confirmed during order review."}
          </ContentBlock>
          <ContentBlock icon={FlaskConical} title="Cannabinoid Info">
            {product.cannabinoidInfo ||
              "Cannabinoid details are confirmed from product labels and available COAs during order review."}
          </ContentBlock>
          <ContentBlock icon={PackageCheck} title="Suggested Use">
            Use only as directed on the final product label. Start with the
            smallest suggested serving and allow time to understand your personal
            response. Intended for adult hemp wellness routines only.
          </ContentBlock>
        </section>

        <aside className="space-y-5">
          <FarmNote
            eyebrow="Before You Buy"
            title="This listing uses honest status labels."
            tone="buy"
          >
            If a batch number, COA, ingredient detail, or availability item is
            still pending, the product stays framed as a request or preview
            until the farm reviews it.
          </FarmNote>
          <Notice icon={ShieldCheck} title="Trust Snapshot" tone="green">
            <ul className="space-y-1">
              <li>Non-intoxicating hemp product.</li>
              <li>CBG-rich where listed on the product label.</li>
              <li>
                {hasCoa
                  ? "Batch-specific COA available for review."
                  : `${getCoaStatusLabel(product)} for this listing.`}
              </li>
              <li>Batch status: {getBatchStatusLabel(product)}.</li>
              <li>Adult use only where required.</li>
              <li>
                Not intended to diagnose, treat, cure, or prevent disease.
              </li>
            </ul>
          </Notice>
          <Notice
            icon={FileText}
            title="COA / Lab Results"
            tone="gold"
          >
            <p>
              {hasJackFrostCoa
                ? "The Jack Frost cbg_001 COA is available as a customer-friendly breakdown with the original report image."
                : hasCoa
                  ? "Use the lab-results link to review available COA notes and batch details."
                  : requiresCoa(product)
                    ? "A batch-specific COA is not linked for this listing yet."
                    : "A COA is not required for this listing type."}
            </p>
            {hasCoa && (
              <Link
                className="focus-ring mt-3 inline-flex rounded-full font-black text-forest-900 underline decoration-clay/40 underline-offset-4 hover:text-clay"
                href={product.coaUrl}
              >
                View lab results
              </Link>
            )}
          </Notice>
          <Notice
            icon={HeartHandshake}
            title="Farm-Direct Review"
            tone="cream"
          >
            Orders are reviewed manually before payment instructions are sent.
            This helps confirm availability, shipping restrictions, and adult-use
            requirements.
          </Notice>
          <Notice
            icon={Truck}
            title="Shipping Restrictions"
            tone="cream"
          >
            {product.shippingRestrictions}
          </Notice>
          <Notice
            icon={PackageCheck}
            title="Age Restriction"
            tone="cream"
          >
            {product.ageRestricted
              ? "Adult hemp wellness product. Age verification and location restrictions may apply."
              : "No adult-use restriction is configured for this listing."}
          </Notice>
          <Notice
            icon={FlaskConical}
            title="General Wellness Disclaimer"
            tone="cream"
          >
            Products are not intended to diagnose, treat, cure, or prevent any
            disease.
          </Notice>
          <Notice
            icon={ShieldCheck}
            title="Safe Use & Storage"
            tone="cream"
          >
            Review product warnings, storage guidance, and responsible-use notes
            before ordering.
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                className="focus-ring inline-flex rounded-full font-black text-forest-900 underline decoration-clay/40 underline-offset-4 hover:text-clay"
                href="/policies/warnings-safe-use"
              >
                Safe use guide
              </Link>
              <Link
                className="focus-ring inline-flex rounded-full font-black text-forest-900 underline decoration-clay/40 underline-offset-4 hover:text-clay"
                href="/policies/storage-shelf-life"
              >
                Storage guide
              </Link>
              <Link
                className="focus-ring inline-flex rounded-full font-black text-forest-900 underline decoration-clay/40 underline-offset-4 hover:text-clay"
                href="/policies/product-traceability"
              >
                Traceability
              </Link>
              <Link
                className="focus-ring inline-flex rounded-full font-black text-forest-900 underline decoration-clay/40 underline-offset-4 hover:text-clay"
                href="/policies/product-quality-complaints"
              >
                Quality concerns
              </Link>
            </div>
          </Notice>
        </aside>
      </div>

      <section className="mt-14">
        <OrderRequestFlow />
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[.82fr_1fr]">
        <div className="seed-card rounded-seed p-6 md:p-8">
          <Leaf aria-hidden className="size-9 text-moss" />
          <h2 className="mt-4 font-display text-3xl font-black text-forest-900">
            Questions before ordering?
          </h2>
          <p className="mt-3 leading-7 text-forest-900/72">
            These answers keep the product page focused on preference,
            transparency, ordering, and compliance. For personal health
            questions, ask a qualified professional.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="secondary">
              Contact the Farm
            </ButtonLink>
            <ButtonLink href="/lab-results" variant="ghost">
              View Lab Results
            </ButtonLink>
            <ButtonLink href="/faq" variant="ghost">
              Read FAQ
            </ButtonLink>
          </div>
        </div>

        <div className="seed-card rounded-seed p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-clay">
            Product FAQ
          </p>
          <div className="mt-6 space-y-4">
            {faqs.map(([question, answer]) => (
              <details
                className="group rounded-2xl border border-forest-900/10 bg-white/55 p-4"
                key={question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-forest-900">
                  <span>{question}</span>
                  <span className="text-xl leading-none text-clay transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-forest-900/72">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-clay">
                Same shelf, shared tags
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-forest-900">
                Related Products
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-forest-900/68">
              Related items come from the same category or share product tags
              like CBG, COA transparency, small batch, or adult use.
            </p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed currentId={product.id} products={allProducts} />
      </main>

      <ProductStickyCartBar product={product} />
    </div>
  );
}

function StockPill({ product }: { product: Product }) {
  const inStock = isAvailableNow(product);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-black ${
        inStock
          ? "border-forest-700/20 bg-forest-50 text-forest-900"
          : "border-clay/20 bg-clay text-cream-50"
      }`}
    >
      <CheckCircle2 aria-hidden className="size-4" />
      {inStock ? "Available Now" : "Coming Soon"}
    </span>
  );
}

function BestForChips({ chips }: { chips: string[] }) {
  if (chips.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">
        Best for
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            className="rounded-full border border-forest-900/10 bg-cream-100 px-3 py-2 text-sm font-bold text-forest-900"
            key={chip}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <article className="seed-card rounded-seed p-5">
      <Icon aria-hidden className="size-6 text-forest-700" />
      <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-clay">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-forest-900/76">
        {value}
      </p>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-forest-900/10 bg-white/45 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-clay">
        {label}
      </p>
      <p className="mt-1 font-bold leading-6 text-forest-900">{value}</p>
    </div>
  );
}

function ContentBlock({
  children,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-forest-900/10 bg-white/45 p-5">
      <Icon aria-hidden className="size-5 text-forest-700" />
      <h3 className="mt-3 font-display text-2xl font-black text-forest-900">
        {title}
      </h3>
      <p className="mt-2 leading-7 text-forest-900/72">{children}</p>
    </div>
  );
}

function Notice({
  children,
  icon: Icon,
  title,
  tone,
}: {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
  tone: "gold" | "green" | "cream";
}) {
  const colors = {
    cream: "bg-cream-50 text-forest-900",
    gold: "bg-harvest-300 text-forest-900",
    green: "bg-forest-700 text-cream-50",
  };

  return (
    <div className={`rounded-seed border border-forest-900/12 p-5 shadow-soft ${colors[tone]}`}>
      <Icon aria-hidden className="size-6" />
      <h3 className="mt-3 font-display text-2xl font-black">{title}</h3>
      <div className="mt-2 text-sm leading-6 opacity-80">{children}</div>
    </div>
  );
}

function getBestForChips(product: Product) {
  const tags = new Set(product.tags.map((tag) => tag.toLowerCase()));
  const chips = new Set<string>();

  if (tags.has("non-intoxicating")) chips.add("Non-intoxicating hemp");
  if (tags.has("cbg") || product.category.includes("CBG")) {
    chips.add("CBG-rich adult routines");
  }
  if (hasBatchSpecificCoa(product)) chips.add("COA transparency shoppers");
  if (tags.has("small batch")) chips.add("Small-batch farm goods");
  if (tags.has("adult use")) chips.add("Adult-use hemp shoppers");
  if (tags.has("bundle")) chips.add("Comparing formats");
  if (product.category === "CBG Gummies") chips.add("Gummy preference");
  if (product.category === "CBG Oils") chips.add("Flexible serving format");
  if (product.category === "Capsules") chips.add("Measured capsule format");
  if (product.category === "Hemp Flower") chips.add("Hemp flower experience");
  if (product.category === "Seeds") chips.add("Seed and genetics planning");

  return Array.from(chips).slice(0, 6);
}

function getServingInfo(product: Product) {
  if (product.slug === "funni-farm-cbg-gummies") {
    return "Per supplied label: 1 gummy serving; 2-3 mg CBG per gummy; 50 gummies per bag.";
  }

  if (product.category === "Bundles") {
    return product.packSize || "See included product labels before ordering.";
  }

  if (product.packSize) {
    return `${product.packSize}. Follow final label directions before use.`;
  }

  return "Serving details are confirmed during order review.";
}

function getProductFaqs(product: Product): Array<[string, string]> {
  return [
    [
      "Is this product non-intoxicating?",
      "This listing is positioned as a non-intoxicating hemp product. Review the product label, batch notes, and available COA information before ordering.",
    ],
    [
      "How do I review batch and lab details?",
      hasBatchSpecificCoa(product)
        ? "Use the COA / Lab Results button on this page to review available lab-result notes and batch details."
        : "A batch-specific COA is not linked for this listing yet. The farm reviews product records before payment instructions are sent.",
    ],
    [
      "How does ordering work?",
      "Checkout sends a manual order request. The Funni Farm reviews availability, age requirements, shipping restrictions, and product details before emailing Cash App, PayPal, or other approved payment options.",
    ],
    [
      "Can this product be shipped anywhere?",
      product.shippingRestrictions ||
        "Shipping rules vary by location. The farm reviews each order before payment instructions are sent.",
    ],
    [
      "Is this medical advice?",
      "No. The Funni Farm products are not intended to diagnose, treat, cure, or prevent any disease. Product information is provided for preference, transparency, and label review.",
    ],
  ];
}
