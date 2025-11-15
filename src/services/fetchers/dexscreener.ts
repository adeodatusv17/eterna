import axios from "axios";
import { withRetry } from "../../utils/retry";
import { Token } from "../../types/token";

const BASE =
  process.env.DEXSCREENER_SEARCH_BASE ||
  "https://api.dexscreener.com/latest/dex/search?q=";

export async function fetchDexscreener(query: string): Promise<Token[]> {
  return withRetry(async () => {
    const { data } = await axios.get(BASE + encodeURIComponent(query));
    const pairs = data?.pairs || [];
    return pairs.map((p: any) => ({
      token_address: p.tokenAddress || p.baseToken?.address,
      token_name: p.tokenName || p.baseToken?.name,
      token_ticker: p.tokenSymbol || p.baseToken?.symbol,
      price_usd: Number(p.priceUsd || 0),
      volume_usd: Number(p.volumeUsd || 0),
      protocol: p.dexId,
      updated_at: Date.now(),
      source: ["dexscreener"]
    }));
  });
}
