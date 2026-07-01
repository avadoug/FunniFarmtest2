import {
  ClipboardCheck,
  FileText,
  FlaskConical,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { businessInfo } from "@/lib/brand/businessInfo";
import { cn } from "@/lib/utils/cn";

const trustItems: Array<{
  icon: LucideIcon;
  label: string;
  text: string;
}> = [
  {
    icon: ClipboardCheck,
    label: "No payment until review",
    text: "The cart creates an order request, not an automatic charge.",
  },
  {
    icon: FlaskConical,
    label: "Lab transparency",
    text: "COA status is labeled honestly by product and batch.",
  },
  {
    icon: ShieldCheck,
    label: "Adult hemp only",
    text: "Age, shipping, and compliance are reviewed before payment.",
  },
  {
    icon: Sprout,
    label: "Tennessee roots",
    text: `${businessInfo.establishedLabel} with real family farm history.`,
  },
  {
    icon: FileText,
    label: "Clear labels",
    text: "Ingredients, serving notes, and batch status stay visible.",
  },
];

export function TrustBar({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      aria-label="Customer trust details"
      className={cn(
        "rounded-seed border border-forest-900/12 bg-cream-50 p-4 shadow-soft",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-3",
          compact ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 xl:grid-cols-5",
        )}
      >
        {trustItems.map((item) => (
          <div
            className="group rounded-[1.15rem] border border-forest-900/10 bg-white/55 p-4 transition hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-soft"
            key={item.label}
            title={item.text}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest-700 text-cream-50 shadow-soft">
                <item.icon aria-hidden className="size-5" />
              </span>
              <p className="text-sm font-black leading-5 text-forest-900">
                {item.label}
              </p>
            </div>
            {!compact && (
              <p className="mt-3 text-xs font-semibold leading-5 text-forest-900/64">
                {item.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
