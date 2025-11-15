import { Token } from "../types/token";

export function merge(lists: Token[][]): Token[] {
  const map = new Map<string, Token>();

  for (const list of lists) {
    for (const t of list) {
      if (!t.token_address) continue;
      const id = t.token_address.toLowerCase();
      const existing = map.get(id);

      if (!existing) {
        map.set(id, { ...t, source: [...(t.source || [])] });
      } else {
        const merged = { ...existing };

        merged.token_name ||= t.token_name;
        merged.token_ticker ||= t.token_ticker;
        merged.price_usd = t.price_usd ?? merged.price_usd;
        merged.volume_usd = t.volume_usd ?? merged.volume_usd;
        merged.protocol ||= t.protocol;
        merged.updated_at = Math.max(merged.updated_at || 0, t.updated_at || 0);

        merged.source = Array.from(
          new Set([...(existing.source || []), ...(t.source || [])])
        );

        map.set(id, merged);
      }
    }
  }

  return Array.from(map.values());
}
