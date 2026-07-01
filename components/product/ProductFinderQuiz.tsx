"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  getCoaStatusLabel,
  hasBatchSpecificCoa,
  isAvailableNow,
} from "@/lib/products/status";
import type { Product, ProductCategory } from "@/lib/products/types";
import { cn } from "@/lib/utils/cn";

type Answers = {
  newToCbg?: "yes" | "somewhat" | "no";
  format?: ProductCategory | "No preference";
  routine?: "daily" | "flexible" | "flower";
  hempTaste?: "yes" | "no" | "not-sure";
  shoppingFor?: "self" | "gift";
};

type QuestionOption<Key extends keyof Answers> = {
  description: string;
  label: string;
  value: NonNullable<Answers[Key]>;
};

type Question<Key extends keyof Answers> = {
  key: Key;
  options: QuestionOption<Key>[];
  prompt: string;
};

const questions: Question<keyof Answers>[] = [
  {
    key: "newToCbg",
    prompt: "Are you new to CBG?",
    options: [
      {
        description: "A simple, label-backed format may feel easiest.",
        label: "Yes, pretty new",
        value: "yes",
      },
      {
        description: "A familiar format with clear details is a good fit.",
        label: "Somewhat",
        value: "somewhat",
      },
      {
        description: "You may want more format flexibility.",
        label: "No, I know my way around",
        value: "no",
      },
    ],
  },
  {
    key: "format",
    prompt: "Do you prefer gummies, capsules, oils, flower, or no preference?",
    options: [
      {
        description: "A familiar edible format with clear label details.",
        label: "Gummies",
        value: "CBG Gummies",
      },
      {
        description: "A measured format for routine-oriented shoppers.",
        label: "Capsules",
        value: "Capsules",
      },
      {
        description: "A flexible bottle format when serving details are available.",
        label: "Oils",
        value: "CBG Oils",
      },
      {
        description: "A more plant-forward hemp flower experience.",
        label: "Flower",
        value: "Hemp Flower",
      },
      {
        description: "Let the quiz compare all active product types.",
        label: "No preference",
        value: "No preference",
      },
    ],
  },
  {
    key: "routine",
    prompt:
      "Do you want something easy for daily routine, flexible serving, or hemp flower experience?",
    options: [
      {
        description: "Simple formats that fit predictable adult routines.",
        label: "Easy daily routine",
        value: "daily",
      },
      {
        description: "Formats where the product label can guide serving choices.",
        label: "Flexible serving",
        value: "flexible",
      },
      {
        description: "A plant-forward product with extra shipping review.",
        label: "Hemp flower experience",
        value: "flower",
      },
    ],
  },
  {
    key: "hempTaste",
    prompt: "Do you dislike hemp taste?",
    options: [
      {
        description: "Gummies or capsules may be easier to browse first.",
        label: "Yes",
        value: "yes",
      },
      {
        description: "Oils and flower can stay in the mix.",
        label: "No",
        value: "no",
      },
      {
        description: "The quiz will keep familiar formats near the top.",
        label: "Not sure",
        value: "not-sure",
      },
    ],
  },
  {
    key: "shoppingFor",
    prompt: "Are you shopping for yourself or as a gift for another adult?",
    options: [
      {
        description: "Recommendations can follow your format preferences.",
        label: "Myself",
        value: "self",
      },
      {
        description: "Gift-friendly, easy-to-understand products rank higher.",
        label: "Another adult",
        value: "gift",
      },
    ],
  },
];

const categoryAliases: Partial<Record<ProductCategory, string[]>> = {
  "CBG Gummies": ["gummy", "gummies", "mixed fruit"],
  "CBG Oils": ["oil", "bottle"],
  Capsules: ["capsule", "capsules"],
  "Hemp Flower": ["flower", "plant", "hemp flower"],
  Seeds: ["seed", "seeds"],
};

export function ProductFinderQuiz({ products }: { products: Product[] }) {
  const [answers, setAnswers] = useState<Answers>({});
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const complete = answeredCount === questions.length;
  const recommendations = useMemo(
    () => recommendProducts(products, answers),
    [answers, products],
  );

  function setAnswer<Key extends keyof Answers>(
    key: Key,
    value: NonNullable<Answers[Key]>,
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
      <section className="seed-card rounded-seed p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-clay">
              Find Your Farm Fit
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-forest-900">
              Five quick preference questions
            </h2>
          </div>
          <Badge tone={complete ? "green" : "cream"}>
            {answeredCount}/{questions.length}
          </Badge>
        </div>
        <div
          aria-label={`Quiz progress ${answeredCount} of ${questions.length}`}
          className="mt-5 h-3 overflow-hidden rounded-full border border-forest-900/10 bg-cream-100"
          role="progressbar"
          aria-valuemax={questions.length}
          aria-valuemin={0}
          aria-valuenow={answeredCount}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-forest-700 via-moss to-harvest-300 transition-all duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-bold leading-6 text-forest-900/64">
          This helps match preferences, not medical needs. You can change any
          answer before comparing products.
        </p>

        <div className="mt-6 space-y-5">
          {questions.map((question, index) => (
            <fieldset
              className="soft-reveal rounded-[1.25rem] border border-forest-900/10 bg-white/50 p-4"
              key={question.key}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <legend className="px-1 font-display text-xl font-black text-forest-900">
                {index + 1}. {question.prompt}
              </legend>
              <div className="mt-4 grid gap-2">
                {question.options.map((option) => {
                  const selected = answers[question.key] === option.value;

                  return (
                    <button
                      aria-pressed={selected}
                      className={cn(
                        "focus-ring rounded-2xl border p-4 text-left transition",
                        selected
                          ? "border-forest-900 bg-forest-700 text-cream-50 shadow-soft"
                          : "border-forest-900/12 bg-cream-50/70 text-forest-900 hover:bg-harvest-300/35",
                      )}
                      key={`${question.key}-${option.value}`}
                      onClick={() => setAnswer(question.key, option.value)}
                      type="button"
                    >
                      <span className="block font-black">{option.label}</span>
                      <span
                        className={cn(
                          "mt-1 block text-sm leading-6",
                          selected ? "text-cream-100/78" : "text-forest-900/66",
                        )}
                      >
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => setAnswers({})}
            type="button"
            variant="ghost"
          >
            <RotateCcw aria-hidden className="size-4" />
            Reset Quiz
          </Button>
          <ButtonLink href="/shop" variant="secondary">
            Browse Full Shop
          </ButtonLink>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-seed border border-forest-900/12 bg-forest-900 p-6 text-cream-50 shadow-farm">
          <div className="flex items-start gap-3">
            <Sparkles
              aria-hidden
              className="mt-1 size-6 shrink-0 text-harvest-300"
            />
            <div>
              <h2 className="font-display text-3xl font-black">
                {complete ? "Your product preference fit" : "Your fit will appear here"}
              </h2>
              <p className="mt-3 leading-7 text-cream-100/78">
                This quiz is for product preference only and is not medical
                advice. It does not diagnose, treat, cure, prevent, or manage
                any disease or condition.
              </p>
            </div>
          </div>
        </div>

        {complete ? (
          <>
            <div className="rounded-seed border border-forest-900/12 bg-cream-50 p-5 shadow-soft">
              <h3 className="font-display text-2xl font-black text-forest-900">
                Why these matched
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-forest-900/72">
                {buildPreferenceNotes(answers).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {recommendations.length > 0 ? (
              <CompareMatches products={recommendations} />
            ) : (
              <div className="rounded-seed border border-dashed border-forest-900/25 bg-cream-50 p-6 text-center">
                <h3 className="font-display text-2xl font-black text-forest-900">
                  No exact fit appeared
                </h3>
                <p className="mt-2 text-sm leading-6 text-forest-900/70">
                  Try retaking the quiz or browsing the full farm shelf.
                </p>
              </div>
            )}

            <div className="rounded-seed border border-harvest-700/30 bg-harvest-300 p-5 text-forest-900 shadow-soft">
              <h3 className="font-display text-2xl font-black">
                Still deciding?
              </h3>
              <p className="mt-2 text-sm leading-6 text-forest-900/72">
                Product pages include ingredients, batch notes, COA links where
                available, adult-use language, and shipping reminders. Review
                the final label before use.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/shop" variant="dark">
                  View All Products
                </ButtonLink>
                <ButtonLink href="/contact" variant="ghost">
                  Ask the Farm
                </ButtonLink>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-seed border border-dashed border-forest-900/25 bg-cream-50/75 p-8 text-center">
            <h3 className="font-display text-2xl font-black text-forest-900">
              Answer all five questions
            </h3>
            <p className="mt-2 leading-7 text-forest-900/70">
              The quiz will suggest 1 to 3 products based on format, routine,
              taste preference, and gift fit.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function recommendProducts(products: Product[], answers: Answers) {
  const scored = products
    .map((product) => ({
      product,
      score: scoreProduct(product, answers),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Number(b.product.inventory > 0) !== Number(a.product.inventory > 0)) {
        return Number(isAvailableNow(b.product)) - Number(isAvailableNow(a.product));
      }
      return Number(b.product.isFeatured) - Number(a.product.isFeatured);
    });

  const positive = scored.filter((item) => item.score > 0);
  const source = positive.length > 0 ? positive : scored;

  return source.slice(0, 3).map((item) => item.product);
}

function scoreProduct(product: Product, answers: Answers) {
  const searchable = [
    product.name,
    product.shortDescription,
    product.fullDescription,
    product.category,
    product.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  let score = product.isFeatured ? 2 : 0;

  if (isAvailableNow(product)) score += 2;
  if (hasBatchSpecificCoa(product)) score += 1;
  if (product.tags.includes("Adult Use")) score += 1;

  if (answers.newToCbg === "yes") {
    score += categoryScore(product, {
      "CBG Gummies": 5,
      Capsules: 4,
      "CBG Oils": 3,
      "Hemp Flower": -2,
      Seeds: -1,
    });
  }

  if (answers.newToCbg === "somewhat") {
    score += categoryScore(product, {
      "CBG Gummies": 4,
      Capsules: 3,
      "CBG Oils": 3,
      "Hemp Flower": 1,
    });
  }

  if (answers.newToCbg === "no") {
    score += categoryScore(product, {
      "Hemp Flower": 4,
      "CBG Oils": 3,
      "CBG Gummies": 2,
      Seeds: 1,
    });
  }

  if (answers.format && answers.format !== "No preference") {
    score += product.category === answers.format ? 8 : -1;
  } else if (answers.format === "No preference") {
    score += product.tags.includes("CBG") ? 2 : 0;
  }

  if (answers.routine === "daily") {
    score += categoryScore(product, {
      "CBG Gummies": 5,
      Capsules: 5,
      "CBG Oils": 3,
      "Hemp Flower": -2,
    });
  }

  if (answers.routine === "flexible") {
    score += categoryScore(product, {
      "CBG Oils": 5,
      "CBG Gummies": 3,
      Capsules: 2,
      "Hemp Flower": 2,
    });
  }

  if (answers.routine === "flower") {
    score += categoryScore(product, {
      "Hemp Flower": 8,
      Seeds: 2,
      "CBG Oils": 1,
    });
  }

  if (answers.hempTaste === "yes") {
    score += categoryScore(product, {
      "CBG Gummies": 6,
      Capsules: 5,
      "CBG Oils": -1,
      "Hemp Flower": -3,
    });
  }

  if (answers.hempTaste === "no") {
    score += categoryScore(product, {
      "CBG Oils": 3,
      "Hemp Flower": 3,
      "CBG Gummies": 1,
    });
  }

  if (answers.hempTaste === "not-sure") {
    score += categoryScore(product, {
      "CBG Gummies": 3,
      Capsules: 3,
      "CBG Oils": 1,
    });
  }

  if (answers.shoppingFor === "gift") {
    score += categoryScore(product, {
      "CBG Gummies": 5,
      Bundles: 4,
      Merch: 3,
      Capsules: 2,
      "CBG Oils": 1,
      "Hemp Flower": -1,
    });
    if (searchable.includes("label")) score += 1;
  }

  if (answers.shoppingFor === "self") {
    score += product.tags.includes("CBG") ? 2 : 0;
  }

  const aliases = categoryAliases[product.category] ?? [];
  if (aliases.some((alias) => searchable.includes(alias))) score += 1;

  return score;
}

function categoryScore(
  product: Product,
  scores: Partial<Record<ProductCategory, number>>,
) {
  return scores[product.category] ?? 0;
}

function buildPreferenceNotes(answers: Answers) {
  const notes = [
    "Recommendations are based on product format, routine fit, taste preference, and adult-use shopping context.",
  ];

  if (answers.newToCbg === "yes") {
    notes.push("New-to-CBG answers favor familiar formats with clear product labels.");
  }

  if (answers.format && answers.format !== "No preference") {
    notes.push(`You selected ${answers.format.toLowerCase()} as a preferred format.`);
  }

  if (answers.routine === "daily") {
    notes.push("Daily-routine answers favor simple, measured product formats.");
  }

  if (answers.routine === "flexible") {
    notes.push("Flexible-serving answers favor products with clear label guidance.");
  }

  if (answers.routine === "flower") {
    notes.push("Hemp flower answers prioritize plant-forward listings with extra shipping review.");
  }

  if (answers.hempTaste === "yes") {
    notes.push("Taste-sensitive answers favor gummies or capsules over hemp-forward formats.");
  }

  if (answers.shoppingFor === "gift") {
    notes.push("Gift answers favor products that are easy for another adult to understand from the label.");
  }

  return notes;
}

function CompareMatches({ products }: { products: Product[] }) {
  return (
    <div className="rounded-seed border border-forest-900/12 bg-cream-50 p-5 shadow-soft">
      <h3 className="font-display text-2xl font-black text-forest-900">
        Compare your top matches
      </h3>
      <div className="mt-4 grid gap-3">
        {products.map((product) => (
          <div
            className="grid gap-3 rounded-2xl border border-forest-900/10 bg-white/55 p-4 text-sm md:grid-cols-[1.1fr_.8fr_.8fr]"
            key={product.id}
          >
            <div>
              <p className="font-black text-forest-900">{product.name}</p>
              <p className="mt-1 text-forest-900/62">{product.category}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-clay">
                COA
              </p>
              <p className="mt-1 font-bold text-forest-900/72">
                {getCoaStatusLabel(product)}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-clay">
                Availability
              </p>
              <p className="mt-1 font-bold text-forest-900/72">
                {isAvailableNow(product) ? "Available Now" : "Coming Soon"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
