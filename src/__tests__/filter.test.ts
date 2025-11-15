import { filterByPeriod } from "../utils/filterSort";
import { Token } from "../types/token";

const tokens: Token[] = [
  { token_address: "1", price_1hr_change: 5 },
  { token_address: "2", price_24h_change: 10 },
  { token_address: "3", price_7d_change: 15 },
];

describe("filterByPeriod()", () => {
  test("filters 1h", () => {
    const out = filterByPeriod(tokens, "1h");
    expect(out.length).toBe(1);
    expect(out[0].price_1hr_change).toBe(5);
  });

  test("filters 24h", () => {
    const out = filterByPeriod(tokens, "24h");
    expect(out.length).toBe(1);
    expect(out[0].price_24h_change).toBe(10);
  });

  test("filters 7d", () => {
    const out = filterByPeriod(tokens, "7d");
    expect(out.length).toBe(1);
    expect(out[0].price_7d_change).toBe(15);
  });
});
