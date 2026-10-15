/**
 * Policy content.
 *
 * Keeping the prose in this data file (instead of scattered across JSX) makes
 * it easy to edit and keeps apostrophes and quotes from tripping up JSX.
 * Each policy renders at its own URL, e.g. /policies/refund.
 */

export type PolicySection = {
  heading: string;
  paragraphs: string[];
};

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: PolicySection[];
};

export const policies: Policy[] = [
  {
    slug: "return",
    title: "Return Policy",
    summary:
      "How returns work for digital and physical products bought on LearnPay.",
    updated: "January 1, 2026",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "LearnPay sells digital courses. Because access is granted instantly, returns are handled as cancellations rather than physical shipments.",
          "This page explains when a return is possible and how to request one.",
        ],
      },
      {
        heading: "Eligibility",
        paragraphs: [
          "You may request a return within 7 days of purchase if you have not consumed more than 25% of the course content.",
          "The order must have been paid in full. Orders that are still pending or that failed are not eligible because no access was granted.",
        ],
      },
      {
        heading: "How to request a return",
        paragraphs: [
          "Email support@learnpay.example with your Razorpay order id, which you can find on the receipt page after checkout.",
          "We reply within 2 business days. If the return is approved, we start a refund automatically.",
        ],
      },
      {
        heading: "Non-returnable items",
        paragraphs: [
          "Downloadable certificates, one-to-one coaching sessions that have already taken place, and gift cards cannot be returned.",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund Policy",
    summary: "Timelines and methods for refunds processed through Razorpay.",
    updated: "January 1, 2026",
    sections: [
      {
        heading: "When we refund",
        paragraphs: [
          "If a return is approved, or if a payment was captured twice, we issue a refund to the original payment method.",
        ],
      },
      {
        heading: "Timelines",
        paragraphs: [
          "Refunds are initiated within 2 business days of approval.",
          "Once initiated, the money usually reaches your account within 5 to 7 business days. UPI refunds are typically faster; card refunds depend on your bank.",
        ],
      },
      {
        heading: "How refunds are processed",
        paragraphs: [
          "Refunds are processed through Razorpay, the same gateway used for the payment. You will receive a confirmation email with the refund reference id.",
        ],
      },
      {
        heading: "Partial refunds",
        paragraphs: [
          "In some cases we may offer a partial refund, for example if only part of a bundle was used. Any partial refund is agreed with you in writing before it is issued.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What data we collect during checkout and how it is used.",
    updated: "January 1, 2026",
    sections: [
      {
        heading: "What we collect",
        paragraphs: [
          "When you check out we store the product you bought, the amount, and the unique Razorpay order and payment ids.",
          "If you provide them, we also store the email address and phone number used to prefill Razorpay Checkout.",
        ],
      },
      {
        heading: "Payment data",
        paragraphs: [
          "We never see or store your full card number, CVV, or UPI credentials. Those are entered on Razorpay's secure checkout and handled entirely by Razorpay.",
        ],
      },
      {
        heading: "How we use data",
        paragraphs: [
          "Order data is used to confirm payments, provide access to what you bought, and handle refunds and support requests.",
          "We do not sell your personal data.",
        ],
      },
      {
        heading: "Data retention",
        paragraphs: [
          "Order records are kept for as long as needed for accounting, tax, and support. You can request deletion of your contact details at any time by emailing support@learnpay.example.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    summary: "Important limits on the information and demo code provided.",
    updated: "January 1, 2026",
    sections: [
      {
        heading: "Educational project",
        paragraphs: [
          "LearnPay is a demo application built to teach how a payment gateway integrates with a web app. It is not a real business.",
        ],
      },
      {
        heading: "No financial advice",
        paragraphs: [
          "Nothing on this site is financial, legal, or tax advice. Always test your own integration thoroughly before accepting real payments.",
        ],
      },
      {
        heading: "Accuracy",
        paragraphs: [
          "We try to keep the content accurate, but payment gateway APIs change over time. Always confirm details against the official Razorpay documentation.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "The code and content are provided as is, without warranty of any kind. You are responsible for how you use them.",
        ],
      },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return policies.find((policy) => policy.slug === slug);
}
