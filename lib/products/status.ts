import type { Product } from "./types";

export type ProductStatusBadge = {
  label:
    | "Available Now"
    | "Coming Soon"
    | "COA Available"
    | "COA Pending"
    | "Batch Pending"
    | "Not Applicable";
  tone: "green" | "gold" | "purple" | "dark" | "cream";
};

const unresolvedPattern = /\b(placeholder|pending)\b/i;

export function hasBatchSpecificCoa(product: Product) {
  const coaUrl = product.coaUrl.trim();

  return Boolean(coaUrl && coaUrl !== "/lab-results" && !unresolvedPattern.test(coaUrl));
}

export function hasBatchNumber(product: Product) {
  return Boolean(
    product.batchNumber.trim() && !unresolvedPattern.test(product.batchNumber),
  );
}

export function requiresCoa(product: Product) {
  return (
    product.category === "CBG Gummies" ||
    product.category === "CBG Oils" ||
    product.category === "Capsules" ||
    product.category === "Hemp Flower" ||
    product.category === "Topicals" ||
    product.category === "Bundles" ||
    product.tags.some((tag) => tag.toLowerCase() === "cbg")
  );
}

export function isAvailableNow(product: Product) {
  if (!product.isActive || product.inventory <= 0) return false;

  if (requiresCoa(product)) {
    return hasBatchSpecificCoa(product) && hasBatchNumber(product);
  }

  return true;
}

export function getProductStatusBadges(product: Product): ProductStatusBadge[] {
  const badges: ProductStatusBadge[] = [
    isAvailableNow(product)
      ? { label: "Available Now", tone: "green" }
      : { label: "Coming Soon", tone: "dark" },
  ];

  if (requiresCoa(product)) {
    badges.push(
      hasBatchSpecificCoa(product)
        ? { label: "COA Available", tone: "green" }
        : { label: "COA Pending", tone: "gold" },
    );
  } else {
    badges.push({ label: "Not Applicable", tone: "cream" });
  }

  if (!hasBatchNumber(product)) {
    badges.push({ label: "Batch Pending", tone: "gold" });
  }

  return badges;
}

export function getCoaStatusLabel(product: Product) {
  if (!requiresCoa(product)) return "Not Applicable";
  return hasBatchSpecificCoa(product) ? "COA Available" : "COA Pending";
}

export function getBatchStatusLabel(product: Product) {
  return hasBatchNumber(product) ? product.batchNumber : "Batch Pending";
}
