import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchEndpoints } from '$lib/utils';

export const PUT: RequestHandler = async ({ request }) => {
  const { endpoints } = await request.json();

  const { casts, endpoints: newEndpoints } = await fetchEndpoints(endpoints);

  return json({ casts, endpoints: newEndpoints });
};