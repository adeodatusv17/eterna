import { filterByPeriod } from "../utils/filterSort";
import { Token } from "../types/token";

describe("filterByPeriod()", () => {
  const now = Date.now();

  const tokens: Token[] = [
    {
      token_address: "1",
      created_at: now - 30 * 60 * 1000, // 30 minutes ago (inside 1h)
    },
    {
      token_address: "2",
      created_at: now - 2 * 60 * 60 * 1000, // 2 hours ago (inside 24h)
    },
    {
      token_address: "3",
      created_at: now - 3 * 24 * 60 * 60 * 1000, // 3 days ago (inside 7d)
    },
    {
      token_address: "4",
      created_at: now - 10 * 24 * 60 * 60 * 1000, // 10 days ago (OUTSIDE 7d)
    },
  ];

  test("filters by 1h", () => {
    const out = filterByPeriod(tokens, "1h");
    expect(out.length).toBe(1);
    expect(out[0].token_address).toBe("1");
  });

  test("filters by 24h", () => {
    const out = filterByPeriod(tokens, "24h");
    expect(out.length).toBe(2); // token 1 + 2
    expect(out.map(t => t.token_address)).toEqual(["1", "2"]);
  });

  test("filters by 7d", () => {
    const out = filterByPeriod(tokens, "7d");
    expect(out.length).toBe(3); // tokens 1, 2, 3
    expect(out.map(t => t.token_address)).toEqual(["1", "2", "3"]);
  });
});
