import { NextResponse, type NextRequest } from "next/server";
import type { ProductInput } from "@/lib/products/types";
import {
  deleteProduct,
  getProducts,
  upsertProduct,
} from "@/lib/products/repository";
import {
  isProductionRuntime,
  PRODUCTION_DATABASE_MESSAGE,
} from "@/lib/runtime/production";
import {
  sanitizeStringArray,
  sanitizeText,
} from "@/lib/utils/sanitize";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD || "";

  if (!expected) return false;

  return request.headers.get("x-admin-password") === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getProducts({ includeInactive: true }));
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isProductionRuntime()) {
    return NextResponse.json(
      { error: PRODUCTION_DATABASE_MESSAGE },
      { status: 501 },
    );
  }

  const body = (await request.json()) as ProductInput;
  const product = await upsertProduct({
    ...body,
    slug: sanitizeText(body.slug, 120),
    name: sanitizeText(body.name, 160),
    shortDescription: sanitizeText(body.shortDescription, 280),
    fullDescription: sanitizeText(body.fullDescription, 4000),
    image: sanitizeText(body.image, 400),
    gallery: sanitizeStringArray(body.gallery, 12),
    tags: sanitizeStringArray(body.tags, 16),
    weight: sanitizeText(body.weight, 120),
    ingredients: sanitizeText(body.ingredients, 3000),
    cannabinoidInfo: sanitizeText(body.cannabinoidInfo, 3000),
    strainLineage: sanitizeText(body.strainLineage, 600),
    seedType: sanitizeText(body.seedType, 160),
    packSize: sanitizeText(body.packSize, 160),
    batchNumber: sanitizeText(body.batchNumber, 160),
    coaUrl: sanitizeText(body.coaUrl, 400),
    hempComplianceNote: sanitizeText(body.hempComplianceNote, 1000),
    shippingRestrictions: sanitizeText(body.shippingRestrictions, 1200),
  });

  return NextResponse.json(product);
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isProductionRuntime()) {
    return NextResponse.json(
      { error: PRODUCTION_DATABASE_MESSAGE },
      { status: 501 },
    );
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const deleted = await deleteProduct(id);
  return NextResponse.json({ deleted });
}
