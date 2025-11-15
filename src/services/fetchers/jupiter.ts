import axios from "axios";
import { withRetry } from "../../utils/retry";
import { Token } from "../../types/token";

const BASE =
  process.env.JUPITER_SEARCH_BASE ||
  "https://lite-api.jup.ag/tokens/v2/search?query=";

export async function fetchJupiter(query: string): Promise<Token[]> {
  return withRetry(async () => {
    const { data } = await axios.get(BASE + encodeURIComponent(query));
    const list = data?.tokens || [];
    return list.map((t: any) => ({
      token_address: t.address || t.mint,
      token_name: t.name,
      token_ticker: t.symbol,
      price_usd: Number(t.price || 0),
      updated_at: Date.now(),
      source: ["jupiter"]
    }));
  });
}
