import { Token } from "../types/token";

export function merge(lists: Token[][]): Token[] {
  const map = new Map<string, Token>();

  const isNum = (v: any): v is number =>
    typeof v === "number" && Number.isFinite(v);

  for (const list of lists) {
    for (const t of list) {
      if (!t.token_address) continue;
      const id = t.token_address.toLowerCase();
      const existing = map.get(id);

      if (!existing) {
        map.set(id, { ...t, source: [...(t.source || [])] });
        continue;
      }

      const merged: Token = { ...existing };

      // Names
      merged.token_name ||= t.token_name;
      merged.token_ticker ||= t.token_ticker;

      // --- NUMERIC FIELDS (Fix) ---
      if (isNum(t.price_usd)) merged.price_usd = t.price_usd;
      if (isNum(t.volume_usd)) merged.volume_usd = t.volume_usd;
      if (isNum(t.market_cap_usd)) merged.market_cap_usd = t.market_cap_usd;
      if (isNum(t.liquidity_usd)) merged.liquidity_usd = t.liquidity_usd;

      if (isNum(t.price_1hr_change)) merged.price_1hr_change = t.price_1hr_change;
      if (isNum(t.price_24h_change)) merged.price_24h_change = t.price_24h_change;
      if (isNum(t.price_7d_change)) merged.price_7d_change = t.price_7d_change;

      // created_at → keep latest non-null
      merged.created_at = Math.max(
        merged.created_at ?? 0,
        t.created_at ?? 0
      );

      // protocol
      merged.protocol ||= t.protocol;

      // updated_at → keep highest timestamp
      merged.updated_at = Math.max(
        merged.updated_at ?? 0,
        t.updated_at ?? 0
      );

      // merge source arrays uniquely
      merged.source = Array.from(
        new Set([...(existing.source || []), ...(t.source || [])])
      );

      map.set(id, merged);
    }
  }

  return Array.from(map.values());
}
