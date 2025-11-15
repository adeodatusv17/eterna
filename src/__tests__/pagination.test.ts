import { paginate } from "../utils/pagination";

describe("pagination()", () => {
  const items = Array.from({ length: 50 }, (_, i) => i + 1);

  test("returns first page correctly", () => {
    const { items: result, nextCursor } = paginate(items, 10);

    expect(result.length).toBe(10);
    expect(result[0]).toBe(1);
    expect(nextCursor).not.toBeNull();
  });

  test("returns second page using cursor", () => {
    const { nextCursor } = paginate(items, 10);
    const { items: page2 } = paginate(items, 10, nextCursor!);

    expect(page2[0]).toBe(11);
  });

  test("returns null cursor when reaching the end", () => {
    const { nextCursor } = paginate(items, 100);
    expect(nextCursor).toBeNull();
  });
});
