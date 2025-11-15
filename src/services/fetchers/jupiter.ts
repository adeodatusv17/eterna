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
    try {
      const url = BASE + encodeURIComponent(query);
      const { data } = await axiosInstance.get(url);
      const list = data?.tokens || [];

      return list.map((t: any) => ({
        token_address: t.address || t.mint || null,
        token_name: t.name || null,
        token_ticker: t.symbol || null,
        price_usd: Number(t.price || 0),
        updated_at: Date.now(),
        source: ["jupiter"]
      }));
    } catch (err: any) {
      console.error("❌ Jupiter ERROR:", err.message);
      throw err;
    }
  });
}
