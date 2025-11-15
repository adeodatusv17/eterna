jest.mock("ioredis");
jest.mock("../services/aggregator");

import supertest from "supertest";
import { buildServer } from "../server";
import * as aggregator from "../services/aggregator";

describe("GET /api/tokens", () => {
  let app: any;

  beforeAll(async () => {
    (aggregator.fetchAndCache as jest.Mock).mockResolvedValue([
      { token_address: "A", price_usd: 10, volume_usd: 50 },
      { token_address: "B", price_usd: 20, volume_usd: 10 },
    ]);

    app = buildServer();

    // ⛔ THIS WAS MISSING — without this fastify.server = null
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("returns tokens", async () => {
    const res = await supertest(app.server).get("/api/tokens");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  test("applies sorting correctly", async () => {
    const res = await supertest(app.server).get("/api/tokens?sort=price");

    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].price_usd).toBe(20);
  });

  test("pagination works", async () => {
    const res = await supertest(app.server).get("/api/tokens?limit=1");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.nextCursor).not.toBeNull();
  });
});
