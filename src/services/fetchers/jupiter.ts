import axios from "axios";
import { withRetry } from "../../utils/retry";
import { Token } from "../../types/token";

const axiosInstance = axios.create({
  timeout: 7000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "application/json"
  }
});

// Correct active Jupiter endpoint
const BASE =
  process.env.JUPITER_SEARCH_BASE ||
  "https://api.jup.ag/swap/v1/tokens?search=";

export async function fetchJupiter(query: string): Promise<Token[]> {
  return withRetry(async () => {
    const url = BASE + encodeURIComponent(query);
    const { data } = await axiosInstance.get(url);
    const list = data?.tokens || [];


    return list.map((t: any) => ({
      token_address: t.address || t.mint || null,

      token_name: t.name || null,
      token_ticker: t.symbol || null,

      price_usd: Number(t.usdPrice || 0),
      volume_usd: Number(t.stats1h?.volumeChange || 0),   // Jupiter does NOT give raw volume
      market_cap_usd: Number(t.mcap || t.fdv || 0),
      liquidity_usd: Number(t.liquidity || 0),

      price_1hr_change: t.stats1h?.priceChange ?? null,
      price_24h_change: t.stats24h?.priceChange ?? null,
      price_7d_change: t.stats24h?.priceChange ?? null,   // Jupiter doesn’t provide 7d → mirror 24h

      created_at: t.firstPool?.createdAt
        ? new Date(t.firstPool.createdAt).getTime()
        : null,

      protocol: t.launchpad || "jupiter",
      updated_at: Date.now(),
      source: ["jupiter"]
    }));
  });
}
