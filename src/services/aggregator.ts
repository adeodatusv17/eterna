import { Token } from "../types/token";
import { fetchDexscreener } from "../services/fetchers/dexscreener";
import { fetchJupiter } from "../services/fetchers/jupiter";
import { getCache, setCache } from "../cache/redisClient";
import { merge } from "./merge";

function cacheKey(query: string) {
  return `tokens:list:${query.toLowerCase()}`;
}

export async function fetchAndCache(query: string): Promise<Token[]> {
  const key = cacheKey(query);

  const cached = await getCache<Token[]>(key);
  if (cached && cached.length > 0) return cached;

  

  const [dex, jup] = await Promise.allSettled([
    fetchDexscreener(query),
    fetchJupiter(query)
  ]);
 


  const lists = [];
  if (dex.status === "fulfilled") lists.push(dex.value);
  if (jup.status === "fulfilled") lists.push(jup.value);
  console.log("🔍 Dexscreener result:", dex.status === "fulfilled" ? dex.value.length : "ERR");
console.log("🔍 Jupiter result:", jup.status === "fulfilled" ? jup.value.length : "ERR");


  const finalList = merge(lists);

  await setCache(key, finalList, Number(process.env.CACHE_TTL_SECONDS || 30));

  return finalList;
}

export async function forceRefresh(query: string): Promise<Token[]> {
  const key = cacheKey(query);

  const [dex, jup] = await Promise.allSettled([
    fetchDexscreener(query),
    fetchJupiter(query)
  ]);

  const lists = [];
  if (dex.status === "fulfilled") lists.push(dex.value);
  if (jup.status === "fulfilled") lists.push(jup.value);

  const finalList = merge(lists);

  await setCache(key, finalList, Number(process.env.CACHE_TTL_SECONDS || 30));

  return finalList;
}
