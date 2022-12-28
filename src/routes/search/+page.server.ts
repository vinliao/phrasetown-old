import type { PageServerLoad } from './$types';
import { getApiUrl } from '$lib/utils';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q');
  if (!query) return { casts: [] };
  console.log(getApiUrl(false));

  const response = await fetch(`${getApiUrl(import.meta.env.PROD)}/v0/search?q=${query}`);
  return {
    casts: (await response.json()).casts
  };
};