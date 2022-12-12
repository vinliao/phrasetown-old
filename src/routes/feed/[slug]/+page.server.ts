import { fetchEndpoints, getFeedEndpoints } from "$lib/utils";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { casts, endpoints } = await fetchEndpoints(getFeedEndpoints(params.slug));

  return {
    casts, endpoints
  };
};