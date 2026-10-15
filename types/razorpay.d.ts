export {};

/**
 * Type definitions for the Razorpay Checkout script
 * (https://checkout.razorpay.com/v1/checkout.js).
 *
 * The script is loaded in the browser and attaches a `window.Razorpay`
 * constructor. Declaring the globals here lets the `PayButton` client
 * component use it with full type safety.
 */
declare global {
  /** What Razorpay sends to our `handler` after a successful payment. */
  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: { color?: string };
    handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
    modal?: {
      ondismiss?: () => void;
    };
  }

  interface RazorpayCheckoutInstance {
    open: () => void;
    on: (event: string, handler: (...args: unknown[]) => void) => void;
  }

  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}
