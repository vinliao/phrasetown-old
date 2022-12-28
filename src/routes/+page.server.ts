import { shuffle } from 'lodash-es';
import { getApiUrl } from '$lib/utils';
import type { PageServerLoad } from './$types';
/**
 * get cached casts from redis
 * 
 * POST /v0/home-cache cache casts to redis and also returns the casts
 */
export const load: PageServerLoad = async ({ params }) => {
  const apiUrl = getApiUrl(import.meta.env.PROD);
  try {
    const response = await fetch(`${apiUrl}/v0/home-cache`);
    return { casts: (await response.json()).casts };
  } catch {
    const response = await fetch(`${apiUrl}/v0/home-cache`, {
      method: 'POST'
    });
    const casts = (await response.json()).casts;
    return { casts: shuffle(casts).slice(0, 15) };
  }
};