/**
 * The product catalogue.
 *
 * This file lives on the SERVER and is the single source of truth for prices.
 * The browser only ever sends a `productId`; the server looks the price up
 * here. Never trust a price that comes from the client.
 */

export type Product = {
  id: string;
  name: string;
  description: string;
  /**
   * Price in paise. Razorpay always works in the smallest currency unit, so
   * ₹499 is sent as 49900. This avoids floating point rounding issues.
   */
  priceInPaise: number;
  currency: "INR";
};

export const products: Product[] = [
  {
    id: "starter",
    name: "Starter Course",
    description:
      "A beginner-friendly course that walks through a complete payment integration end to end.",
    priceInPaise: 49900,
    currency: "INR",
  },
  {
    id: "pro",
    name: "Pro Course",
    description:
      "Everything in Starter, plus webhooks, refunds and production hardening tips.",
    priceInPaise: 99900,
    currency: "INR",
  },
  {
    id: "bundle",
    name: "All-Access Bundle",
    description: "Every course and every future update. The best value.",
    priceInPaise: 149900,
    currency: "INR",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** Convert paise to a readable rupee string: 49900 -> "₹499.00". */
export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(paise / 100);
}
