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

const BASE =
  process.env.DEXSCREENER_SEARCH_BASE ||
  "https://api.dexscreener.com/latest/dex/search?q=";

export async function fetchDexscreener(query: string): Promise<Token[]> {
  return withRetry(async () => {
    try {
      const url = BASE + encodeURIComponent(query);
      const resp = await axiosInstance.get(url);
      const pairs = resp.data?.pairs || [];

      return pairs.map((p: any) => ({
        token_address: p.baseToken?.address || null,
        token_name: p.baseToken?.name || null,
        token_ticker: p.baseToken?.symbol || null,
        price_usd: Number(p.priceUsd || 0),
        volume_usd: Number(p.volume?.h24 || 0),
        protocol: p.dexId || null,
        updated_at: Date.now(),
        source: ["dexscreener"]
      }));
    } catch (err: any) {
      console.error("❌ Dexscreener ERROR:", err.message);
      throw err;
    }
  });
}
