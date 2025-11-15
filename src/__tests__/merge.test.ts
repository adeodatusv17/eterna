jest.mock("p-retry");
import { merge } from "../services/merge";

describe("merge()", () => {
  test("merges duplicate token entries", () => {
    const list1 = [
      { token_address: "AAA", price_usd: 1, source: ["dex"] },
    ];

    const list2 = [
      { token_address: "AAA", volume_usd: 100, source: ["jup"] },
    ];

    const out = merge([list1, list2]);
    const merged = out[0];

    expect(merged.price_usd).toBe(1);
    expect(merged.volume_usd).toBe(100);
    expect(merged.source).toContain("dex");
    expect(merged.source).toContain("jup");
  });
});
