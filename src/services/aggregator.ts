import { Token } from "../types/token";
import { fetchDexscreener } from "./fetchers/dexscreener";
import { fetchJupiter } from "./fetchers/jupiter";
import { getCache, setCache } from "../cache/redisClient";
import { merge } from "./merge";

const KEY = "tokens:list";



export async function fetchAndCache(query: string): Promise<Token[]> {
  const cached = await getCache<Token[]>(KEY);
  if (cached) return cached;

  const [dex, jup] = await Promise.allSettled([
    fetchDexscreener(query),
    fetchJupiter(query)
  ]);

  const lists = [];
  if (dex.status === "fulfilled") lists.push(dex.value);
  if (jup.status === "fulfilled") lists.push(jup.value);

  const finalList = merge(lists);

  await setCache(KEY, finalList, Number(process.env.CACHE_TTL_SECONDS || 30));

  return finalList;
}

export async function forceRefresh(query: string): Promise<Token[]> {
  const [dex, jup] = await Promise.allSettled([
    fetchDexscreener(query),
    fetchJupiter(query)
  ]);

  const lists = [];
  if (dex.status === "fulfilled") lists.push(dex.value);
  if (jup.status === "fulfilled") lists.push(jup.value);

  const finalList = merge(lists);

  await setCache(KEY, finalList, Number(process.env.CACHE_TTL_SECONDS || 30));

  return finalList;
}
