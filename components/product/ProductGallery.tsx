"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[1.4rem] border border-forest-900/10 bg-cream-100 shadow-soft">
        <Image
          alt={name}
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          src={selected}
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              aria-label={`Show ${name} image ${index + 1}`}
              className={cn(
                "focus-ring relative aspect-square overflow-hidden rounded-2xl border bg-cream-100",
                selected === image
                  ? "border-forest-900 shadow-soft"
                  : "border-forest-900/10",
              )}
              key={`${image}-${index}`}
              onClick={() => setSelected(image)}
              type="button"
            >
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="120px"
                src={image}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
