import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  isOrderEmailConfigured,
  ORDER_EMAIL_NOT_CONFIGURED_MESSAGE,
  sendOrderRequestEmail,
} from "@/lib/email/order-request";
import { createOrder } from "@/lib/orders/repository";
import { getProducts } from "@/lib/products/repository";
import { isProductionRuntime } from "@/lib/runtime/production";
import {
  sanitizeEmail,
  sanitizeText,
} from "@/lib/utils/sanitize";
import { isAvailableNow } from "@/lib/products/status";

const checkoutSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().default(""),
    address1: z.string().min(1),
    address2: z.string().optional().default(""),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1).default("US"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1),
  compliance: z.object({
    ageConfirmed: z.boolean(),
    nonIntoxicatingAcknowledged: z.boolean(),
    diseaseDisclaimerAccepted: z.boolean(),
    lawsAccepted: z.boolean(),
  }),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the checkout form and try again." },
      { status: 400 },
    );
  }

  const { compliance } = parsed.data;

  if (
    !compliance.ageConfirmed ||
    !compliance.nonIntoxicatingAcknowledged ||
    !compliance.diseaseDisclaimerAccepted ||
    !compliance.lawsAccepted
  ) {
    return NextResponse.json(
      {
        error:
          "Age, non-intoxicating hemp, product disclaimer, and legal compliance confirmations are required.",
      },
      { status: 400 },
    );
  }

  try {
    const products = await getProducts();
    const items = parsed.data.items.map((item) => {
      const product = products.find(
        (candidate) => candidate.id === item.productId,
      );

      if (!product || !isAvailableNow(product)) {
        throw new Error(`Product unavailable: ${item.productId}`);
      }

      const quantity = Math.min(item.quantity, product.inventory);

      return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        category: product.category,
        quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity,
      };
    });
    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
    const customer = parsed.data.customer;
    const sanitizedCustomer = {
      firstName: sanitizeText(customer.firstName, 80),
      lastName: sanitizeText(customer.lastName, 80),
      email: sanitizeEmail(customer.email),
      phone: sanitizeText(customer.phone, 40),
      address1: sanitizeText(customer.address1, 160),
      address2: sanitizeText(customer.address2, 160),
      city: sanitizeText(customer.city, 80),
      state: sanitizeText(customer.state, 40).toUpperCase(),
      postalCode: sanitizeText(customer.postalCode, 20),
      country: sanitizeText(customer.country, 40).toUpperCase(),
    };

    if (isOrderEmailConfigured()) {
      const orderNumber = createOrderRequestNumber();
      const email = await sendOrderRequestEmail({
        orderNumber,
        customer: sanitizedCustomer,
        items,
        compliance,
        subtotal,
        origin: request.nextUrl.origin,
      });

      return NextResponse.json({
        provider: "manual-email",
        sessionId: email.id,
        checkoutUrl: createConfirmationUrl({
          customerEmail: sanitizedCustomer.email,
          mode: "email",
          orderNumber,
          origin: request.nextUrl.origin,
        }),
        orderNumber,
        emailSent: true,
      });
    }

    if (isProductionRuntime()) {
      return NextResponse.json(
        { error: ORDER_EMAIL_NOT_CONFIGURED_MESSAGE },
        { status: 501 },
      );
    }

    const sessionId = `dev_email_${crypto.randomUUID()}`;
    const order = await createOrder({
      status: "order_request_pending_email",
      customer: sanitizedCustomer,
      items,
      subtotal,
      estimatedShipping: 0,
      estimatedTax: 0,
      total: subtotal,
      compliance,
      paymentProvider: "manual-email",
      paymentSessionId: sessionId,
      paymentSessionUrl: `${request.nextUrl.origin}/order-confirmation`,
      notes:
        "Development-only order request. Configure Resend and FUNNI_FARM_ORDER_EMAIL to email Funni Farm in production.",
    });

    return NextResponse.json({
      provider: "manual-email",
      sessionId,
      checkoutUrl: createConfirmationUrl({
        customerEmail: sanitizedCustomer.email,
        mode: "email-dev",
        orderNumber: order.orderNumber,
        origin: request.nextUrl.origin,
      }),
      orderNumber: order.orderNumber,
      emailSent: false,
      message:
        "Order request saved locally for development. Configure Resend to email Funni Farm.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout could not be started.",
      },
      { status: 400 },
    );
  }
}

function createOrderRequestNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `FF-${date}-${suffix}`;
}

function createConfirmationUrl({
  customerEmail,
  mode,
  orderNumber,
  origin,
}: {
  customerEmail: string;
  mode: "email" | "email-dev";
  orderNumber: string;
  origin: string;
}) {
  const url = new URL("/order-confirmation", origin);
  url.searchParams.set("order", orderNumber);
  url.searchParams.set("mode", mode);
  url.searchParams.set("email", customerEmail);
  return url.toString();
}
