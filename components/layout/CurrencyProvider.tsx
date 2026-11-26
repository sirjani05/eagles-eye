"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const SUPPORTED_CURRENCIES = ["GBP", "USD", "EUR"] as const;
type Currency = (typeof SUPPORTED_CURRENCIES)[number];

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

const CURRENCY_LABELS: Record<Currency, string> = {
  GBP: "GBP (£)",
  USD: "USD ($)",
  EUR: "EUR (€)",
};

// Approximate exchange rates from GBP
const EXCHANGE_RATES: Record<Currency, number> = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17,
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
  label: string;
  convert: (amount: number, from?: Currency) => number;
  format: (amount: number, from?: Currency) => string;
  supported: readonly Currency[];
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GBP");

  useEffect(() => {
    const stored = localStorage.getItem("currency");
    if (stored && SUPPORTED_CURRENCIES.includes(stored as Currency)) {
      // Use a microtask to avoid synchronous setState in effect
      queueMicrotask(() => setCurrencyState(stored as Currency));
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("currency", c);
    } catch {
      // ignore
    }
  }, []);

  const convert = useCallback(
    (amount: number, from: Currency = "GBP") => {
      const gbpAmount = amount / EXCHANGE_RATES[from];
      return gbpAmount * EXCHANGE_RATES[currency];
    },
    [currency],
  );

  const format = useCallback(
    (amount: number, from: Currency = "GBP") => {
      const converted = convert(amount, from);
      return `${CURRENCY_SYMBOLS[currency]}${converted.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    },
    [currency, convert],
  );

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    symbol: CURRENCY_SYMBOLS[currency],
    label: CURRENCY_LABELS[currency],
    convert,
    format,
    supported: SUPPORTED_CURRENCIES,
  };

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}

export { SUPPORTED_CURRENCIES, CURRENCY_SYMBOLS, CURRENCY_LABELS, EXCHANGE_RATES };
export type { Currency };