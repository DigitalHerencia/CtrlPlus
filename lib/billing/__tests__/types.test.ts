import { describe, it, expect } from "vitest";
import {
  PaymentStatus,
  billingLineItemSchema,
  createCheckoutSessionSchema,
  getPaymentStatusSchema,
} from "../types";

describe("PaymentStatus enum", () => {
  it("has the expected values", () => {
    expect(PaymentStatus.PENDING).toBe("PENDING");
    expect(PaymentStatus.PAID).toBe("PAID");
    expect(PaymentStatus.FAILED).toBe("FAILED");
    expect(PaymentStatus.CANCELLED).toBe("CANCELLED");
    expect(PaymentStatus.REFUNDED).toBe("REFUNDED");
  });
});

describe("billingLineItemSchema", () => {
  const validItem = {
    name: "Vehicle Wrap – Carbon Fibre",
    unitAmount: 150000,
    currency: "usd",
    quantity: 1,
  };

  it("accepts a valid line item", () => {
    const result = billingLineItemSchema.parse(validItem);
    expect(result.name).toBe("Vehicle Wrap – Carbon Fibre");
    expect(result.unitAmount).toBe(150000);
    expect(result.currency).toBe("usd");
    expect(result.quantity).toBe(1);
  });

  it("coerces currency to lower-case", () => {
    const result = billingLineItemSchema.parse({
      ...validItem,
      currency: "USD",
    });
    expect(result.currency).toBe("usd");
  });

  it("accepts an optional description", () => {
    const result = billingLineItemSchema.parse({
      ...validItem,
      description: "Full vehicle wrap",
    });
    expect(result.description).toBe("Full vehicle wrap");
  });

  it("rejects an empty name", () => {
    expect(() => billingLineItemSchema.parse({ ...validItem, name: "" })).toThrow();
  });

  it("rejects a non-positive unitAmount", () => {
    expect(() => billingLineItemSchema.parse({ ...validItem, unitAmount: 0 })).toThrow();
  });

  it("rejects a currency code that is not 3 characters", () => {
    expect(() => billingLineItemSchema.parse({ ...validItem, currency: "us" })).toThrow();
  });

  it("rejects a non-integer quantity", () => {
    expect(() => billingLineItemSchema.parse({ ...validItem, quantity: 1.5 })).toThrow();
  });
});

describe("createCheckoutSessionSchema", () => {
  const validInput = {
    items: [
      {
        name: "Gloss Black Wrap",
        unitAmount: 80000,
        currency: "usd",
        quantity: 1,
      },
    ],
    successUrl: "https://example.com/success",
    cancelUrl: "https://example.com/cancel",
  };

  it("accepts a valid checkout session input", () => {
    const result = createCheckoutSessionSchema.parse(validInput);
    expect(result.items).toHaveLength(1);
    expect(result.successUrl).toBe("https://example.com/success");
  });

  it("accepts an optional customerEmail", () => {
    const result = createCheckoutSessionSchema.parse({
      ...validInput,
      customerEmail: "customer@example.com",
    });
    expect(result.customerEmail).toBe("customer@example.com");
  });

  it("rejects an invalid customerEmail", () => {
    expect(() =>
      createCheckoutSessionSchema.parse({
        ...validInput,
        customerEmail: "not-an-email",
      }),
    ).toThrow();
  });

  it("rejects an empty items array", () => {
    expect(() => createCheckoutSessionSchema.parse({ ...validInput, items: [] })).toThrow();
  });

  it("rejects an invalid successUrl", () => {
    expect(() =>
      createCheckoutSessionSchema.parse({
        ...validInput,
        successUrl: "not-a-url",
      }),
    ).toThrow();
  });
});

describe("getPaymentStatusSchema", () => {
  it("accepts a valid session ID", () => {
    const result = getPaymentStatusSchema.parse({ sessionId: "cs_test_123" });
    expect(result.sessionId).toBe("cs_test_123");
  });

  it("rejects an empty session ID", () => {
    expect(() => getPaymentStatusSchema.parse({ sessionId: "" })).toThrow();
  });
});
