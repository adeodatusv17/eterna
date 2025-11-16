// utils/filterSort.ts
import { Token } from "../types/token"; // <- adjust path if your file structure differs

export type Period = "1h" | "24h" | "7d";
export type SortKey = "price" | "volume" | "market_cap" | "change";

export function filterByPeriod(tokens: Token[], period?: Period): Token[] {
  if (!period) return tokens;

  const now = Date.now();

  const periodMs: Record<Period, number> = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now - periodMs[period];

  return tokens.filter(t => {
    // created_at is expected to be milliseconds since epoch or undefined/null
    if (typeof t.created_at !== "number") return false;
    return t.created_at >= cutoff;
  });
}

export function sortTokens(
  tokens: Token[],
  sortKey?: SortKey,
  order: "asc" | "desc" = "desc"
): Token[] {
  if (!sortKey) return tokens;

  const map: Record<SortKey, keyof Token> = {
    price: "price_usd",
    volume: "volume_usd",
    market_cap: "market_cap_usd",
    change: "price_24h_change",
  };

  const field = map[sortKey];

  const toNum = (v: any) => {
    if (v == null) return Number.NEGATIVE_INFINITY;
    if (typeof v === "number") return Number.isFinite(v) ? v : Number.NEGATIVE_INFINITY;

    // If it's a string like "140.3" or "1,200"
    const cleaned = Number(String(v).replace(/[^0-9eE.\-+]/g, ""));
    return Number.isFinite(cleaned) ? cleaned : Number.NEGATIVE_INFINITY;
  };

  return tokens.slice().sort((a, b) => {
    const av = toNum((a as any)[field]);
    const bv = toNum((b as any)[field]);

    return order === "asc" ? av - bv : bv - av;
  });
}
