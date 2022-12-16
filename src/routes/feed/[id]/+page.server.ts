import { fetchEndpoints, getEndpoints } from "$lib/utils";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { casts, endpoints } = await fetchEndpoints(getEndpoints(params.id));

  return {
    casts, endpoints
  };
};