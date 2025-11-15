import { sortTokens } from "../utils/filterSort";
import { Token } from "../types/token";

const tokens: Token[] = [
  { token_address: "A", price_usd: 5, volume_usd: 10, market_cap_usd: 20, price_24h_change: 1 },
  { token_address: "B", price_usd: 10, volume_usd: 5, market_cap_usd: 50, price_24h_change: 5 },
];

describe("sortTokens()", () => {
  test("sort by price desc", () => {
    const sorted = sortTokens(tokens, "price", "desc");
    expect(sorted[0].price_usd).toBe(10);
  });

  test("sort by volume asc", () => {
    const sorted = sortTokens(tokens, "volume", "asc");
    expect(sorted[0].volume_usd).toBe(5);
  });

  test("sort by market cap desc", () => {
    const sorted = sortTokens(tokens, "market_cap", "desc");
    expect(sorted[0].market_cap_usd).toBe(50);
  });

  test("sort by change desc", () => {
    const sorted = sortTokens(tokens, "change", "desc");
    expect(sorted[0].price_24h_change).toBe(5);
  });
});
