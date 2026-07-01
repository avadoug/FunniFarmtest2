import { promises as fs } from "fs";
import path from "path";
import type { Order } from "./types";
import { assertDevelopmentWrite } from "@/lib/runtime/production";

const DATA_PATH = path.join(process.cwd(), "data", "orders.local.json");

async function readOrderFile() {
  const raw = await fs.readFile(DATA_PATH, "utf8").catch((error: unknown) => {
    if (isMissingFile(error)) return "[]";
    throw error;
  });
  return JSON.parse(raw) as Order[];
}

async function writeOrderFile(orders: Order[]) {
  await fs.writeFile(DATA_PATH, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

export async function createOrder(
  order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
) {
  assertDevelopmentWrite();

  const orders = await readOrderFile();
  const now = new Date().toISOString();
  const orderNumber = `FF-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${String(orders.length + 1).padStart(4, "0")}`;

  const nextOrder: Order = {
    ...order,
    id: `ord_${crypto.randomUUID()}`,
    orderNumber,
    createdAt: now,
    updatedAt: now,
  };

  orders.push(nextOrder);
  await writeOrderFile(orders);
  return nextOrder;
}

export async function getOrderByNumber(orderNumber: string) {
  const orders = await readOrderFile();
  return orders.find((order) => order.orderNumber === orderNumber) ?? null;
}

function isMissingFile(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
