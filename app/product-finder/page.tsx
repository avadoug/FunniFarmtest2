import type { Metadata } from "next";
import { FarmNote } from "@/components/brand/FarmNote";
import { ProductFinderQuiz } from "@/components/product/ProductFinderQuiz";
import { ProductComparison } from "@/components/product/ProductComparison";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBar } from "@/components/brand/TrustBar";
import { getProducts } from "@/lib/products/repository";

export const metadata: Metadata = {
  title: "Find Your Farm Fit",
  description:
    "A lightweight product preference quiz for The Funni Farm CBG-rich hemp wellness catalog.",
};

export default async function ProductFinderPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Find your fit"
        title="Find Your Farm Fit"
      >
        <p>
          Answer five friendly preference questions and get a simple,
          non-medical recommendation from the current Funni Farm product list.
          This quiz is for product preference only and is not medical advice.
        </p>
      </SectionHeading>

      <div className="mt-7">
        <TrustBar compact />
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <FarmNote
          eyebrow="Product finder note"
          title="This quiz matches preferences, not health needs."
          tone="good"
        >
          Results are based on format, taste preference, routine style, COA
          status, and availability. It does not provide medical advice.
        </FarmNote>
        <FarmNote
          eyebrow="Farm note"
          title="The farm still reviews every request."
          tone="buy"
        >
          A quiz result does not guarantee availability or shipping eligibility.
          The manual order request flow confirms those details before payment.
        </FarmNote>
      </div>

      <div className="mt-8">
        <ProductFinderQuiz products={products} />
      </div>

      <section className="mt-14">
        <ProductComparison products={products} />
      </section>
    </div>
  );
}
