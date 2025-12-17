import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import crypto from 'crypto';

import { client } from '@/sanity/lib/client';

const DEFAULT_REVALIDATE = 900; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const { query, params = {}, revalidate }: { query?: string; params?: Record<string, any>; revalidate?: number } =
      await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const cacheKey = crypto
      .createHash('md5')
      .update(query + JSON.stringify(params))
      .digest('hex');

    const cachedFetch = unstable_cache(
      async () => {
        const data = await client.fetch(query, params);
        return data;
      },
      ['sanity', cacheKey],
      {
        revalidate: revalidate ?? DEFAULT_REVALIDATE,
        tags: ['sanity'],
      },
    );

    const data = await cachedFetch();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Cached Sanity route error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Sanity' }, { status: 500 });
  }
}

