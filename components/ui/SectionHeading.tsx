import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-clay">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-black leading-tight text-forest-900 md:text-5xl">
        {title}
      </h2>
      {children && (
        <div className="mt-4 text-base leading-7 text-forest-900/78 md:text-lg">
          {children}
        </div>
      )}
    </div>
  );
}
