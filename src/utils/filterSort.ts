
export type Period = "1h" | "24h" | "7d";
export type SortKey = "price" | "volume" | "market_cap" | "change";

export interface Token {
  price_usd?: number;
  volume_usd?: number;
  market_cap_usd?: number;
  price_1hr_change?: number;
  price_24h_change?: number;
  price_7d_change?: number;
}

export function filterByPeriod(tokens: Token[], period?: Period): Token[] {
  if (!period) return tokens;

  const map: Record<Period, keyof Token> = {
    "1h": "price_1hr_change",
    "24h": "price_24h_change",
    "7d": "price_7d_change",
  };

  const field = map[period];

  return tokens.filter(t => typeof t[field] === "number");
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

  return tokens.toSorted((a: any, b: any) => {
    const av = a[field] ?? -Infinity;
    const bv = b[field] ?? -Infinity;
    return order === "asc" ? av - bv : bv - av;
  });
}
