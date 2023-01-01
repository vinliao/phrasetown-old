import { shuffle } from 'lodash-es';
import { getApiUrl, transformMerkleCast } from '$lib/utils';
import type { PageServerLoad } from './$types';
import type { Cast as MerkleCast } from '$lib/types/merkleCast';
/**
 * get cached casts from redis
 * 
 * POST /v0/home-cache cache casts to redis and also returns the casts
 */
export const load: PageServerLoad = async ({ params }) => {
  const apiUrl = getApiUrl(import.meta.env.PROD);
  try {
    const response = await fetch(`${apiUrl}/v0/trending-casts`);
    const casts = (await response.json()).casts;
    return { casts: casts.map((cast: MerkleCast) => transformMerkleCast(cast)) };
  } catch {
    const response = await fetch(`${apiUrl}/v0/index-trending-casts`, {
      method: 'POST'
    });
    const casts = (await response.json()).casts.map((cast: MerkleCast) => transformMerkleCast(cast));
    return { casts: shuffle(casts).slice(0, 15) };
  }
};