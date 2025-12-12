import crypto from 'crypto';
import { unstable_cache } from 'next/cache';

import { client } from '@/sanity/lib/client';

type SanityFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

const DEFAULT_REVALIDATE = 900; // 15 minutes

export async function sanityFetch<T = any>(
  query: string,
  params: Record<string, any> = {},
  options: SanityFetchOptions = {},
): Promise<T> {
  const cacheKey = crypto.createHash('md5').update(query + JSON.stringify(params)).digest('hex');
  const revalidate = options.revalidate ?? DEFAULT_REVALIDATE;
  const tags = options.tags ?? ['sanity'];

  const cachedFetch = unstable_cache(
    () => client.fetch<T>(query, params),
    ['sanity', cacheKey],
    { revalidate, tags },
  );

  return cachedFetch();
}

