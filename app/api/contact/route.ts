import { promises as fs } from "fs";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  isProductionRuntime,
  PRODUCTION_DATABASE_MESSAGE,
} from "@/lib/runtime/production";
import { sanitizeEmail, sanitizeText } from "@/lib/utils/sanitize";

const DATA_PATH = path.join(process.cwd(), "data", "contact-submissions.local.json");

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  wholesale: z.boolean().default(false),
  productQuestion: z.boolean().default(false),
  orderSupport: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const parsed = contactSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete the contact form." },
      { status: 400 },
    );
  }

  if (isProductionRuntime()) {
    return NextResponse.json(
      { error: PRODUCTION_DATABASE_MESSAGE },
      { status: 501 },
    );
  }

  const submission = {
    id: `contact_${crypto.randomUUID()}`,
    name: sanitizeText(parsed.data.name, 120),
    email: sanitizeEmail(parsed.data.email),
    message: sanitizeText(parsed.data.message, 4000),
    wholesale: parsed.data.wholesale,
    productQuestion: parsed.data.productQuestion,
    orderSupport: parsed.data.orderSupport,
    createdAt: new Date().toISOString(),
  };

  const raw = await fs.readFile(DATA_PATH, "utf8").catch((error: unknown) => {
    if (isMissingFile(error)) return "[]";
    throw error;
  });
  const submissions = JSON.parse(raw) as unknown[];
  submissions.push(submission);
  await fs.writeFile(DATA_PATH, `${JSON.stringify(submissions, null, 2)}\n`);

  return NextResponse.json({
    ok: true,
    message:
      "Mock submission saved locally. Connect an email service before launch.",
  });
}

function isMissingFile(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
