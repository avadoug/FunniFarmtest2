import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  FlaskConical,
  HeartHandshake,
  Home,
  PackageCheck,
  Sprout,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { businessInfo } from "@/lib/brand/businessInfo";
import { farmImages } from "@/lib/brand/farmImages";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The story of The Funni Farm, a family-owned Tennessee hemp farm focused on quality, transparency, care, and batch review.",
};

const storyParagraphs = [
  "The Funni Farm was established in October 2012 from a simple dream and a family determined to build something meaningful.",
  "Our children gave the farm its name in October of 2012, and what began as a traditional family farm eventually grew into something new. In 2020, we transitioned from raising livestock to cultivating hemp, carrying with us the same values of hard work, honesty, and respect for the land.",
  "Today, we're proud to be a family-owned Tennessee hemp farm. From cultivation to finished products, we focus on quality, transparency, and care every step of the way. Product batches are crafted with attention to detail and reviewed with independent lab records so you can shop with confidence.",
  "Our mascot, Hershey, the last remaining steer from our livestock days, is a reminder of where we started and the journey that brought us here.",
  "Thank you for supporting our family, our farm, and our mission. Welcome to The Funni Farm.",
];

const values = [
  {
    icon: Home,
    title: "Tennessee Farm",
    text: "A family-owned Tennessee hemp farm focused on quality, transparency, and care.",
  },
  {
    icon: Sprout,
    title: "Family Grown",
    text: "The farm name came from the family in 2012, and that same spirit still shapes the work.",
  },
  {
    icon: FlaskConical,
    title: "COA Transparency",
    text: "Batch records and independent lab testing support clear product review before ordering.",
  },
  {
    icon: HeartHandshake,
    title: "Honest Care",
    text: "The brand is rooted in hard work, honesty, respect for the land, and clear product information.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            alt=""
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src="/brand/hero-farm.svg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream-50/98 via-cream-50/92 to-cream-50/70" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cream-50 to-transparent" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:px-8">
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="absolute -inset-3 rounded-[2.5rem] border-2 border-harvest-700/35 bg-harvest-300/22 shadow-soft" />
            <div className="paper-texture relative overflow-hidden rounded-[2.2rem] border-2 border-forest-900 bg-cream-50 p-3 shadow-farm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.65rem] border border-forest-900/15 bg-cream-100">
                <Image
                  alt={farmImages.hersheyFenceSun.alt}
                  className="object-cover object-center"
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 90vw"
                  src={farmImages.hersheyFenceSun.src}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/48 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border border-cream-50/30 bg-cream-50/92 p-2 pr-4 shadow-soft backdrop-blur">
                  <span className="relative block size-12 overflow-hidden rounded-full border border-forest-900/20">
                    <Image
                      alt="The Funni Farm logo"
                      className="object-cover"
                      fill
                      sizes="48px"
                      src="/brand/funni-farm-official-logo.png"
                    />
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-forest-900">
                    Hershey watches over it
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <SectionHeading
              eyebrow="Our Story"
              title={`${businessInfo.establishedLabel}, with a new chapter.`}
            >
              <p>
                The Funni Farm was born from a simple dream and a family
                determined to build something meaningful.
              </p>
            </SectionHeading>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/shop">Shop Products</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Contact the Farm
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="paper-texture rounded-[2rem] border border-forest-900/12 bg-cream-50 p-6 shadow-farm md:p-10">
          <h1 className="font-display text-4xl font-black text-forest-900 md:text-6xl">
            Our Story
          </h1>
          <div className="mt-7 space-y-5 text-lg leading-8 text-forest-900/78">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <StoryPhoto
            image={farmImages.hempFieldSun}
            title="Cultivated in Tennessee"
            text="The hemp chapter grew from the same hard work, honesty, and respect for the land that shaped the farm from the beginning."
          />
          <StoryPhoto
            image={farmImages.hersheyFenceCard}
            title="Hershey still watches over it"
            text="The farm has grown into a new hemp chapter, but Hershey keeps the livestock roots and family story close."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {values.map((value) => (
            <Value
              icon={value.icon}
              key={value.title}
              text={value.text}
              title={value.title}
            />
          ))}
        </div>
      </section>

      <section className="bg-forest-900 py-16 text-cream-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <StoryBlock title="From Livestock to Hemp">
            The farm legally transitioned from raising livestock to growing hemp
            in 2020, carrying forward the same family values into a new chapter.
          </StoryBlock>
          <StoryBlock title="Close to Home">
            From cultivation to finished products, the farm focuses on quality,
            transparency, and care every step of the way.
          </StoryBlock>
          <StoryBlock title="Hershey the Mascot">
            Hershey, the last remaining steer from the livestock days, is a
            reminder of where the farm started and the journey that brought it
            here.
          </StoryBlock>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <PackageCheck
          aria-hidden
          className="mx-auto size-10 text-forest-700"
        />
        <h2 className="mt-4 font-display text-4xl font-black text-forest-900">
          Honest hemp products from a real family farm.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl leading-7 text-forest-900/72">
          The Funni Farm is committed to high-quality hemp products with
          transparency, batch review, available COAs, and care from cultivation
          to finished product.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/lab-results" variant="secondary">
            View Lab Results
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Get in Touch
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

function Value({
  icon: Icon,
  text,
  title,
}: {
  icon: typeof Sprout;
  text: string;
  title: string;
}) {
  return (
    <div className="seed-card rounded-seed p-5">
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-forest-700 text-cream-50">
        <Icon aria-hidden className="size-5" />
      </div>
      <h2 className="font-display text-2xl font-black text-forest-900">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-forest-900/70">{text}</p>
    </div>
  );
}

function StoryBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-seed border border-cream-50/12 bg-cream-50/8 p-6">
      <BadgeCheck aria-hidden className="mb-4 size-7 text-harvest-300" />
      <h2 className="font-display text-3xl font-black text-harvest-300">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-cream-100/72">{children}</p>
    </div>
  );
}

function StoryPhoto({
  image,
  text,
  title,
}: {
  image: { alt: string; src: string };
  text: string;
  title: string;
}) {
  return (
    <article className="group seed-card overflow-hidden rounded-seed">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          alt={image.alt}
          className="object-cover transition duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={image.src}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/52 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <h2 className="font-display text-2xl font-black text-forest-900">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-forest-900/70">{text}</p>
      </div>
    </article>
  );
}
