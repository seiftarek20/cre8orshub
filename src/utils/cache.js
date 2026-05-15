const cacheStore = new Map();

export const CACHE_TTL = {
  short: 15 * 1000,
  standard: 30 * 1000,
  public: 60 * 1000,
};

export function makeCacheKey(...parts) {
  return parts
    .filter((part) => part !== undefined && part !== null && part !== '')
    .map((part) => String(part))
    .join(':');
}

export async function getCachedData(key, ttlMs, loader) {
  const now = Date.now();
  const cached = cacheStore.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const value = await loader();
  cacheStore.set(key, {
    value,
    expiresAt: now + ttlMs,
  });

  return value;
}

export function invalidateCache(key) {
  cacheStore.delete(key);
}

export function invalidateCachePrefix(prefix) {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

export function invalidateCaches(prefixes) {
  prefixes.forEach(invalidateCachePrefix);
}
